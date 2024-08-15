import { Module } from '@nestjs/common';
import { Menu } from 'src/menus/entity/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { RedisModule } from 'src/redis/redis.module';
import { OrdersRepository } from './orders.repository';
import { OrdersReader } from './implement/orders.reader';
import { Order } from './entity/order.entity';
import { OrderDetail } from './entity/order-detail.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Menu, Order, OrderDetail]), RedisModule],
    controllers: [OrdersController],
    providers: [
        // Service
        OrdersService,

        // Implement
        OrdersReader,

        // Repository
        OrdersRepository,
    ],
    exports: [OrdersRepository, OrdersReader],
})
export class OrdersModule {}
