import { Injectable } from '@nestjs/common';
import { Stores2Repository } from '../stores2.repository';
import { Store } from 'src/stores/entity/store.entity';
import { StoresException } from 'src/global/exception/stores-exception';
import { LocationUtil } from '../util/pickup-time.util';

@Injectable()
export class Stores2Validator {
    constructor(private readonly storesRepository: Stores2Repository) {}

    async checkExist(store: Store): Promise<void> {
        const isExist = await this.storesRepository.findOne({ id: store.id });
        if (!isExist) {
            throw StoresException.ENTITY_NOT_FOUND;
        }
    }

    async checkApprove(store: Store): Promise<void> {
        const isApproved = await this.storesRepository.checkApprove(store);
        if (!isApproved) {
            throw StoresException.NOT_APPROVED;
        }
    }

    async checkOpen(store: Store): Promise<void> {
        const isOpend = await this.storesRepository.checkOpen(store);
        if (!isOpend) {
            throw StoresException.NOT_APPROVED;
        }
    }

    async checkDistance(store: Store, userLat: number, userLon: number) {
        const storeLat = store.detail.lat;
        const storeLon = store.detail.lon;
        const distance = LocationUtil.measureDistance(userLat, storeLat, userLon, storeLon);
        if (distance > 3000) {
            throw StoresException.HAS_LONG_DISTANCE;
        }
    }
}
