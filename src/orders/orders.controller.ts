import { Body, Controller, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { SkipThrottle } from '@nestjs/throttler';
import { OrderMenuDto } from './dto/order-menu.dto';

@SkipThrottle()
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly orderService: OrdersService,
        // @InjectRedis() private readonly redis: Redis,
    ) {}

    // TODO) 주문번호 생성 여부에 따라 Status Code 분리
    @Patch('create-order-number')
    async createOrder(@Body() orderRequest: OrderMenuDto) {
        return await this.orderService.checkStockAndLock(orderRequest);
    }
}
