import { InjectRedis } from '@nestjs-modules/ioredis';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { Redis } from 'ioredis';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        @InjectRedis() private readonly redis: Redis,
    ) {}

    @Patch()
    async createOrder(@Body() orderRequest: { phone: string; orders: { menuId: number; quantity: number }[] }) {
        const response = await this.orderService.checkStockAndLock({ orders: orderRequest.orders });
        return response;
    }

    @Get()
    async getHello() {
        await this.redis.set('key', 'Redis data!');
        const redisData = await this.redis.get('key');
        return { redisData };
    }
}
