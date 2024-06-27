import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from 'src/orders/orders.service';
import { DataSource, QueryRunner } from 'typeorm';
import { Redis } from 'ioredis';
import { Lock } from 'redlock';
import { OrderMenuDto } from 'src/orders/dto/order-menu.dto';
import { Menu } from 'src/menus/entity/menu.entity';
import { OrderExceotion } from 'src/global/exception/order-exceptoin';
import { RedisModule } from 'src/redis/redis.module';
import { RedlockService } from 'src/redis/redlock.service';
import { RedisService } from 'src/redis/redis.service';

describe('OrderService', () => {
    let service: OrdersService;
    let dataSourceMock: DataSource;
    let redisMock: Redis;
    let redlockServiceMock: RedlockService;
    let redisServiceMock: RedisService;
    let queryRunnerMock: QueryRunner;

    beforeEach(async () => {
        queryRunnerMock = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: {
                decrement: jest.fn(),
            },
        } as unknown as QueryRunner;

        dataSourceMock = {
            createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
        } as unknown as DataSource;

        redisMock = {
            get: jest.fn(),
            set: jest.fn(),
            decrby: jest.fn(),
        } as unknown as Redis;

        redlockServiceMock = {
            acquireLocks: jest
                .fn()
                .mockResolvedValue([
                    { release: jest.fn() } as unknown as Lock,
                    { release: jest.fn() } as unknown as Lock,
                    { release: jest.fn() } as unknown as Lock,
                ]),
            releaseLocks: jest.fn().mockResolvedValue(undefined),
        } as unknown as RedlockService;

        redisServiceMock = {
            get: jest.fn(),
            set: jest.fn(),
            decrby: jest.fn(),
        } as unknown as RedisService;

        const module: TestingModule = await Test.createTestingModule({
            imports: [RedisModule],
            providers: [
                OrdersService,
                { provide: DataSource, useValue: dataSourceMock },
                { provide: RedlockService, useValue: redlockServiceMock },
                { provide: RedisService, useValue: redisServiceMock },
            ],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
    });

    it('OrderService가 의존성을 잘 주입받은채 생성됬는지 확인', () => {
        expect(service).toBeDefined();
    });

    describe('acquireLocks 메서드 테스트', () => {
        it('모든 메뉴 항목에 대해 잠금을 획득하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            const locks: Lock[] = [];
            await service['acquireLocks'](orderRequest, locks);

            expect(redlockServiceMock.acquireLocks).toHaveBeenCalledTimes(1);
            expect(locks.length).toBe(orderRequest.orders.length);
        });
    });

    describe('checkStock 메서드 테스트', () => {
        it('수량이 충분하지 않으면 재고 부족목록을 반환하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            // Redis mock 설정
            (redisServiceMock.get as jest.Mock).mockImplementation((key: string) => {
                if (key === 'menu:1:id') return Promise.resolve('5');
                if (key === 'menu:2:id') return Promise.resolve('1'); // 재고 부족
                if (key === 'menu:3:id') return Promise.resolve('5');
                return Promise.resolve(null);
            });

            const redisRollbackData = [];
            const result = await service['checkStock'](orderRequest, redisRollbackData);

            expect(result).toEqual([{ menuId: 2, requestedQuantity: 2, stockQuantity: 1 }]);
        });

        it('재고가 Redis에서 찾을 수 없는 경우 REDIS_NOT_FOUND를 발생하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            // Redis mock 설정
            (redisServiceMock.get as jest.Mock).mockImplementation((key: string) => {
                if (key === 'menu:1:id') return Promise.resolve('10');
                if (key === 'menu:2:id') return Promise.resolve('11');
                if (key === 'menu:3:id') return Promise.resolve(null); // Redis에 menu정보가 없음
                return Promise.resolve(null);
            });

            const redisRollbackData = [];

            await expect(service['checkStock'](orderRequest, redisRollbackData)).rejects.toThrow(
                OrderExceotion.REDIS_NOT_FOUND,
            );
        });
    });

    describe('updateStock 메서드 테스트', () => {
        it('MySQL과 Redis에서 재고를 업데이트하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            await service['updateStock'](orderRequest, queryRunnerMock);

            expect(queryRunnerMock.manager.decrement).toHaveBeenCalledWith(Menu, { id: 1 }, 'count', 3);
            expect(queryRunnerMock.manager.decrement).toHaveBeenCalledWith(Menu, { id: 2 }, 'count', 2);
            expect(queryRunnerMock.manager.decrement).toHaveBeenCalledWith(Menu, { id: 3 }, 'count', 3);
            expect(redisServiceMock.decrby).toHaveBeenCalledWith('menu:1:id', 3);
            expect(redisServiceMock.decrby).toHaveBeenCalledWith('menu:2:id', 2);
            expect(redisServiceMock.decrby).toHaveBeenCalledWith('menu:3:id', 3);
        });
    });

    describe('rollbackRedis 메서드 테스트', () => {
        it('Redis 데이터를 원래 상태로 롤백하는지 테스트', async () => {
            const redisRollbackData = [
                { key: 'menu:1:id', value: 10 },
                { key: 'menu:2:id', value: 11 },
                { key: 'menu:3:id', value: 10 },
            ];

            await service['rollbackRedis'](redisRollbackData);

            expect(redisServiceMock.set).toHaveBeenCalledWith('menu:1:id', '10');
            expect(redisServiceMock.set).toHaveBeenCalledWith('menu:2:id', '11');
            expect(redisServiceMock.set).toHaveBeenCalledWith('menu:3:id', '10');
        });
    });

    describe('checkStockAndLock 메서드 성공 및 다양한 에러 시나리오 테스트', () => {
        it('재고가 충분한 경우 트랜잭션을 커밋하고 랜덤한 5개의 숫자와 3개의 문자인 orderId를 반환하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            // Redis mock 설정
            (redisServiceMock.get as jest.Mock).mockImplementation((key: string) => {
                if (key === 'menu:1:id') return Promise.resolve('10');
                if (key === 'menu:2:id') return Promise.resolve('11');
                if (key === 'menu:3:id') return Promise.resolve('10');
                return Promise.resolve(null);
            });

            const result = await service.checkStockAndLock(orderRequest);

            expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
            expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
            expect(result).toHaveProperty('orderId');
            if (!Array.isArray(result)) {
                expect(result.orderId).toMatch(/^\d{5}[A-Z]{3}$/); // orderId 형식 확인
            }
        });

        it('재고가 부족한 경우 insufficientStock을 반환하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            // Redis mock 설정
            (redisServiceMock.get as jest.Mock).mockImplementation((key: string) => {
                if (key === 'menu:1:id') return Promise.resolve('10');
                if (key === 'menu:2:id') return Promise.resolve('1'); // 재고 부족
                if (key === 'menu:3:id') return Promise.resolve('10');
                return Promise.resolve(null);
            });

            const result = await service.checkStockAndLock(orderRequest);

            expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
            expect(result).toEqual([{ menuId: 2, requestedQuantity: 2, stockQuantity: 1 }]);
        });

        it('재고가 Redis에서 찾을 수 없는 경우 트랜잭션을 롤백하고 예외를 발생하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            (redisServiceMock.get as jest.Mock).mockImplementation((key: string) => {
                if (key === 'menu:1:id') return Promise.resolve('10');
                if (key === 'menu:2:id') return Promise.resolve('11');
                if (key === 'menu:3:id') return Promise.resolve(null); // Redis에 menu정보가 없음
                return Promise.resolve(null);
            });

            await expect(service.checkStockAndLock(orderRequest)).rejects.toThrow(OrderExceotion.REDIS_NOT_FOUND);
            expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
            expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
        });

        it('예외가 발생하면 트랜잭션을 롤백하고 Redis 데이터를 롤백하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            // Redis mock 설정
            (redisServiceMock.get as jest.Mock).mockResolvedValue('10');

            // 일부러 예외를 발생시키기 위해 acquireLocks에서 예외를 발생시킴
            jest.spyOn(service as any, 'acquireLocks').mockImplementation(() => {
                throw new Error('acquireLocks failed');
            });

            await expect(service.checkStockAndLock(orderRequest)).rejects.toThrow(
                OrderExceotion.FAIL_ORDER_TRANSACTION,
            );

            expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
        });
    });
});
