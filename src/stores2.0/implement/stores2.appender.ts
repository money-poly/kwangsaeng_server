import { Injectable } from '@nestjs/common';
import { Stores2Repository } from '../stores2.repository';
import { Store } from 'src/stores/entity/store.entity';

@Injectable()
export class Stores2Appender {
    constructor(private readonly storesRepository: Stores2Repository) {}

    async addMenuOrder(store: Store, menuId: number) {
        const order = store.detail.menuOrders ? store.detail.menuOrders : [];
        order.unshift(menuId);
        const newStore = new Store({ ...store });
        newStore.detail.menuOrders = order;

        return await this.storesRepository.findOneAndUpdate({ id: store.id }, newStore);
    }
}
