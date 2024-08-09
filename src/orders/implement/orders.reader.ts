import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../orders.repository';

export class OrdersReader {
    constructor(private readonly ordersRepository: OrdersRepository) {}

    async read(id: number) {
        return await this.ordersRepository.findOne({ id }, {}, {});
    }
}
