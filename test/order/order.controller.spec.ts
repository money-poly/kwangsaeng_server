import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { OrderController } from 'src/order/order.controller';
import { OrderService } from 'src/order/order.service';

describe('OrderController', () => {
    let controller: OrderController;
    let redis: Redis;

    // OrderController와 관련된 의존성들을 모킹(mocking)
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrderController], // 테스트 대상으로 지정
            providers: [
                {
                    provide: OrderService,
                    useValue: {
                        // 필요에 따라 모킹할 메서드를 정의
                        checkStockAndLock: jest.fn(),
                    },
                },
                {
                    provide: 'default_IORedisModuleConnectionToken', // 레디스 클라이언트 모킹
                    useValue: {
                        set: jest.fn(),
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<OrderController>(OrderController);
        redis = module.get<Redis>('default_IORedisModuleConnectionToken');
    });

    it('should be defined', () => {
        // OrderController가 정의되어 있는지 확인
        expect(controller).toBeDefined();
    });

    describe('jmeterTest', () => {
        it('should log and return the order request', async () => {
            const consoleSpy = jest.spyOn(console, 'log');
            const orderRequest = { message: 'test' };

            const result = await controller.jmeterTestr(orderRequest);

            expect(consoleSpy).toHaveBeenCalledWith(orderRequest);
            expect(result).toEqual(orderRequest);
        });
    });

    describe('getHello', () => {
        it('should set and get a value from Redis', async () => {
            const redisSetSpy = jest.spyOn(redis, 'set').mockResolvedValue('OK');
            const redisGetSpy = jest.spyOn(redis, 'get').mockResolvedValue('Redis data!');

            const result = await controller.getHello();

            expect(redisSetSpy).toHaveBeenCalledWith('key', 'Redis dadta!');
            expect(redisGetSpy).toHaveBeenCalledWith('key');
            expect(result).toEqual({ redisData: 'Redis data!' });
        });
    });
});
