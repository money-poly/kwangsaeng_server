import { StoresException } from 'src/global/exception/stores-exception';
import { CreateStoreDto } from '../dto/create-store.dto';
import { StoresService } from '../stores.service';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CreateStoreValidationPipe implements PipeTransform {
    constructor(private readonly storesService: StoresService) {}

    async transform(dto: CreateStoreDto) {
        await this.validationName(dto.name);

        return dto;
    }

    async validationName(name: string) {
        const exist = await this.storesService.existStore({
            where: {
                name,
            },
        });

        if (exist) {
            throw StoresException.ALREADY_EXIST_STORE_NAME;
        }
    }
}
