import { InjectRedis } from '@nestjs-modules/ioredis';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { Redis } from 'ioredis';
import { SkipThrottle } from '@nestjs/throttler';
import { OrderMenuDto } from './dto/order-menu.dto';

@SkipThrottle()
@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        @InjectRedis() private readonly redis: Redis,
    ) {}

    @Patch()
    async createOrder(@Body() orderRequest: OrderMenuDto) {
        console.log(orderRequest);

        const response = await this.orderService.checkStockAndLock(orderRequest);
        return response;
    }

    @Patch('/test')
    async jmeterTestr(@Body() orderRequest) {
        console.log(orderRequest);

        return orderRequest;
    }

    @Get()
    async getHello() {
        await this.redis.set('key', 'Redis dadta!');
        const redisData = await this.redis.get('key');
        return { redisData };
    }
}
