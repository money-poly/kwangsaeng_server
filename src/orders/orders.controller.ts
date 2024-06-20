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

    @Patch()
    async createOrder(@Body() orderRequest: OrderMenuDto) {
        return await this.orderService.checkStockAndLock(orderRequest);
    }
}
