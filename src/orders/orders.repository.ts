import { Injectable, Logger } from '@nestjs/common';
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
import { AbstractRepository } from 'src/global/common/abstract.repository';

@Injectable()
export class OrdersRepository extends AbstractRepository<Order> {
    protected readonly logger = new Logger(OrdersRepository.name);

    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        @InjectRepository(OrderDetail)
        private readonly orderDetail: Repository<OrderDetail>,
        entityManager: EntityManager,
    ) {
        super(orders, entityManager);
    }

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

    findTopOrderMenusLogic<Order>(qb: SelectQueryBuilder<Order>) {
        return qb.select('count(*)').addSelect('menu_id').groupBy('menu_id').orderBy('count(*)', 'DESC');
    }
}
