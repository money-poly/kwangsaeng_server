import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from 'src/orders/orders.controller';
import { OrdersService } from 'src/orders/orders.service';
import { OrderMenuDto } from 'src/orders/dto/order-menu.dto';

describe('OrderController', () => {
    let controller: OrdersController;
    let service: OrdersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrdersController],
            providers: [
                {
                    provide: OrdersService,
                    useValue: {
                        checkStockAndLock: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<OrdersController>(OrdersController);
        service = module.get<OrdersService>(OrdersService);
    });

    it('orderController가 정의되있는지 확인', () => {
        expect(controller).toBeDefined();
    });

    describe('createOrder컨트롤러 테스트', () => {
        it(' OrderService.checkStockAndLock 잘 호출하는지 테스트', async () => {
            const orderRequest: OrderMenuDto = {
                orders: [
                    { menuId: 1, quantity: 3 },
                    { menuId: 2, quantity: 2 },
                    { menuId: 3, quantity: 3 },
                ],
            };
            //service 객체의 checkStockAndLock 메서드를 추적하여
            //checkStockAndLock가 호출되었는지, 호출된 인수는 무엇인지 추적
            const serviceSpy = jest.spyOn(service, 'checkStockAndLock').mockResolvedValueOnce(undefined);

            await controller.createOrder(orderRequest); //실제 테스트 수행
            //checkStockAndLock 메서드가 orderRequest 인수와 함께 호출되었는지 검증
            expect(serviceSpy).toHaveBeenCalledWith(orderRequest);
        });
    });
});
