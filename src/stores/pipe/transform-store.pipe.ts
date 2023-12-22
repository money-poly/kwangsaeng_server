import { StoresException } from 'src/global/exception/stores-exception';
import { StoresService } from '../stores.service';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformStorePipe implements PipeTransform {
    constructor(private readonly storesService: StoresService) {}

    async transform(value: number) {
        const store = await this.storesService.findOneStore({
            id: value,
        });

        if (!store) {
            throw StoresException.ENTITY_NOT_FOUND;
        }

        return store;
    }
}
