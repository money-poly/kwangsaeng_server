import { Injectable } from '@nestjs/common';
import { Stores2Repository } from '../stores2.repository';

@Injectable()
export class Stores2Reader {
    constructor(private readonly storesRepository: Stores2Repository) {}

    async readOne(id: number) {
        return await this.storesRepository.findOne(
            { id },
            {},
            { approve: true, detail: true, businessDetail: true, user: true },
        );
    }

    async readOneByUser(userId: number) {
        return await this.storesRepository.findOne(
            { user: { id: userId } },
            {},
            { approve: true, detail: true, businessDetail: true, user: true },
        );
    }
}
