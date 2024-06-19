import { Module } from '@nestjs/common';
import { Menu } from 'src/menus/entity/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([Menu])],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
