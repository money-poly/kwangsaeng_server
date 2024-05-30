import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from 'src/orders/orders.controller';

describe('OrdersController', () => {
    let controller: OrdersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
        }).compile();

        controller = module.get<OrdersController>(OrdersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
