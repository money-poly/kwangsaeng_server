import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../orders.repository';
import { Order } from '../entity/order.entity';
import { ExecuteQueryBuilderType } from 'src/global/common/execute-qb-type.enum';

@Injectable()
export class OrdersReader {
    constructor(private readonly ordersRepository: OrdersRepository) {}

    async read(id: number) {
        return await this.ordersRepository.findOne({ id }, {}, {});
    }

    async readTopOrderMenus() {
        let qb = this.ordersRepository.createQueryBuilder(Order);

        qb = this.ordersRepository.leftJoinOrderDetail(qb);
        qb = this.ordersRepository.findTopOrderMenusLogic(qb);

        const executingQuery = await this.ordersRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return executingQuery;
    }
}
