import { Injectable } from '@nestjs/common';
import { Stores2Repository } from '../stores2.repository';
import { Store } from 'src/stores/entity/store.entity';
import { StoresException } from 'src/global/exception/stores-exception';

@Injectable()
export class Stores2Validator {
    constructor(private readonly storesRepository: Stores2Repository) {}

    async checkApprove(store: Store): Promise<void> {
        const isApproved = await this.storesRepository.checkApprove(store);
        if (!isApproved) {
            throw StoresException.NOT_APPROVED;
        }
    }
}
