import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Menu } from 'src/menus/entity/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Menu])],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
