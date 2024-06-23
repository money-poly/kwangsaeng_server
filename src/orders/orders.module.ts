import { Module } from '@nestjs/common';
import { Menu } from 'src/menus/entity/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
    imports: [TypeOrmModule.forFeature([Menu]), RedisModule],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
