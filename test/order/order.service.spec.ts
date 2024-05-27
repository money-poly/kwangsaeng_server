import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from 'src/order/order.service';
import { DataSource, QueryRunner } from 'typeorm';
import { Redis } from 'ioredis';
import Redlock, { Lock } from 'redlock';
import { OrderMenuDto } from 'src/order/dto/order-menu.dto';
import { Menu } from 'src/menus/entity/menu.entity';
import { OrderExceotion } from 'src/global/exception/order-exceptoin';

describe('OrderService', () => {
    let service: OrderService;
    let dataSourceMock: DataSource;
    let redisMock: Redis;
    let redlockMock: Redlock;
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

        redlockMock = {
            acquire: jest.fn().mockResolvedValue({
                release: jest.fn(),
            } as unknown as Lock),
        } as unknown as Redlock;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                { provide: DataSource, useValue: dataSourceMock },
                { provide: 'default_IORedisModuleConnectionToken', useValue: redisMock },
            ],
        }).compile();

        service = module.get<OrderService>(OrderService);
        service['redlock'] = redlockMock;
    });

    it('OrderService 잘 존재하는지 확인', () => {
        expect(service).toBeDefined();
    });

    describe('acquireLocks ', () => {
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

            expect(redlockMock.acquire).toHaveBeenCalledTimes(orderRequest.orders.length);
            expect(locks.length).toBe(orderRequest.orders.length);
        });
    });

    describe('checkStock ', () => {
        it('수량이 충분하지 않으면 재고 부족목록을 반환하는지 테스트 ', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            // Redis mock 설정
            (redisMock.get as jest.Mock).mockImplementation((key: string) => {
                if (key === 'menu:1:id') return Promise.resolve('5');
                if (key === 'menu:2:id') return Promise.resolve('1'); // 재고 부족
                if (key === 'menu:3:id') return Promise.resolve('5');
                return Promise.resolve(null);
            });

            const redisRollbackData = [];
            const result = await service['checkStock'](orderRequest, redisRollbackData);

            expect(result).toEqual([{ menuId: 2, requestedQuantity: 2, stockQuantity: 1 }]);
        });

        it('재고가 Redis에서 찾을 수 없는 경우 REDIS_NOT_FOUND를 발생하는지 테스트 ', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            // Redis mock 설정
            (redisMock.get as jest.Mock).mockImplementation((key: string) => {
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

    describe('updateStock ', () => {
        it('MySQL과 Redis에서 재고를 업데이트하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            const redisRollbackData = [];
            (redisMock.get as jest.Mock).mockImplementation((key: string) => {
                if (key === 'menu:1:id') return Promise.resolve('10');
                if (key === 'menu:2:id') return Promise.resolve('11');
                if (key === 'menu:3:id') return Promise.resolve('10');
                return Promise.resolve(null);
            });

            await service['updateStock'](orderRequest, queryRunnerMock, redisRollbackData);

            expect(queryRunnerMock.manager.decrement).toHaveBeenCalledWith(Menu, { id: 1 }, 'count', 3);
            expect(queryRunnerMock.manager.decrement).toHaveBeenCalledWith(Menu, { id: 2 }, 'count', 2);
            expect(queryRunnerMock.manager.decrement).toHaveBeenCalledWith(Menu, { id: 3 }, 'count', 3);
            expect(redisMock.decrby).toHaveBeenCalledWith('menu:1:id', 3);
            expect(redisMock.decrby).toHaveBeenCalledWith('menu:2:id', 2);
            expect(redisMock.decrby).toHaveBeenCalledWith('menu:3:id', 3);
        });
    });
    describe('rollbackRedis', () => {
        it('Redis 데이터를 원래 상태로 롤백하는지 테스트 ', async () => {
            const redisRollbackData = [
                { key: 'menu:1:id', value: 10 },
                { key: 'menu:2:id', value: 11 },
                { key: 'menu:3:id', value: 10 },
            ];

            await service['rollbackRedis'](redisRollbackData);

            expect(redisMock.set).toHaveBeenCalledWith('menu:1:id', '10');
            expect(redisMock.set).toHaveBeenCalledWith('menu:2:id', '11');
            expect(redisMock.set).toHaveBeenCalledWith('menu:3:id', '10');
        });
    });
});
