import { Injectable } from '@nestjs/common';
import { Stores2Repository } from '../stores2.repository';

@Injectable()
export class Stores2Reader {
    constructor(private readonly storesRepository: Stores2Repository) {}

    async read(id: number) {
        return await this.storesRepository.findOne({ id }, {}, { approve: true, detail: true, businessDetail: true });
    }
}
