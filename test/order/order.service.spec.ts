import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from 'src/order/order.service';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';
import Redlock from 'redlock';
import { OrderMenuDto } from 'src/order/dto/order-menu.dto';
import { OrderExceotion } from 'src/global/exception/order-exceptoin';

describe('OrderService', () => {
    let service: OrderService;
    let dataSourceMock: DataSource;
    let redisMock: Redis;
    let redlockMock: Redlock;
    let queryRunnerMock;

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
        };

        dataSourceMock = {
            createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock), // 모의 함수가 호출될 때 반환할 값을 설정
        } as any;

        redisMock = {
            get: jest.fn(),
            set: jest.fn(),
            decrby: jest.fn(),
        } as any;

        redlockMock = {
            //비동기 함수가 성공적으로 실행된 후 반환할 값을 설정
            acquire: jest.fn().mockResolvedValue({
                release: jest.fn(),
            } as any),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                {
                    provide: DataSource,
                    useValue: dataSourceMock,
                },
                {
                    provide: 'default_IORedisModuleConnectionToken',
                    useValue: redisMock,
                },
            ],
        }).compile();

        service = module.get<OrderService>(OrderService);
        // Replace redlock instance with a mock
        service['redlock'] = redlockMock;
    });

    it('OrderService가 정의 되어 있는지 확인', () => {
        expect(service).toBeDefined();
    });

    describe('checkStockAndLock함수 ', () => {
        it('재고가 충분할 때 트랜잭션을 커밋하고 orderId를 반환하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            (redisMock.get as jest.Mock).mockResolvedValue('10');
            const result = await service.checkStockAndLock(orderRequest);

            expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
            expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
            if (Array.isArray(result)) {
                throw new Error('Expected orderId but got insufficientStock');
            }
            expect(result.orderId).toMatch(/^\d{5}[A-Z]{3}$/); // Check format of orderId
        });

        it('should rollback transaction and rethrow error when an error occurs', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };

            (redisMock.get as jest.Mock).mockResolvedValue(null); // Simulate Redis not found error

            await expect(service.checkStockAndLock(orderRequest)).rejects.toThrow(OrderExceotion.REDIS_NOT_FOUND);

            expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
            expect(queryRunnerMock.release).toHaveBeenCalled();
        });
    });
});
