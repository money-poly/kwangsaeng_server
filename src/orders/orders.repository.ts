import { Injectable } from '@nestjs/common';
import {
    EntityManager,
    FindOptionsRelations,
    FindOptionsSelect,
    FindOptionsWhere,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { Order } from './entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entity/order-detail.entity';

@Injectable()
export class OrdersRepository {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        @InjectRepository(OrderDetail)
        private readonly orderDetail: Repository<OrderDetail>,
        private readonly entityManager: EntityManager,
    ) {}

    async findOne(
        where: FindOptionsWhere<Order>,
        select?: FindOptionsSelect<Order>,
        relations?: FindOptionsRelations<Order>,
    ): Promise<Order> {
        return await this.orders.findOne({
            where,
            select,
            relations,
        });
    }

    async findMany(
        where: FindOptionsWhere<Order>,
        select?: FindOptionsSelect<Order>,
        relations?: FindOptionsRelations<Order>,
    ): Promise<Order[]> {
        return await this.orders.find({
            where,
            select,
            relations,
        });
    }

    async createQueryBuilder() {
        return this.entityManager.createQueryBuilder(Order, 'o');
    }
}
