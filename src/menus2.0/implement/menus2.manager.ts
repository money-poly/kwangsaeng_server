import { Injectable } from '@nestjs/common';
import { Menus2Repository } from '../menus2.repository';
import { Menus2Reader } from './menus2.reader';

@Injectable()
export class Menus2Manager {
    constructor(
        private readonly menusRepository: Menus2Repository,
        private readonly menusReader: Menus2Reader,
    ) {}

    async managePrearrangedSale() {
        const menus = await this.menusReader.readPrearrangedSale();
        await this.menusRepository.updateStatusToPrearrangedSale(menus);
    }
}
