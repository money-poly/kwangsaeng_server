import { StoresException } from 'src/global/exception/stores-exception';
import { StoresService } from '../stores.service';
import { Injectable, PipeTransform } from '@nestjs/common';
import { Seller } from 'src/users/entity/seller.entity';

@Injectable()
export class CreateStoreUserValidationPipe implements PipeTransform {
    constructor(private readonly storesService: StoresService) {}

    async transform(user: Seller) {
        await this.validationUser(user);

        return user;
    }

    async validationUser(user: Seller) {
        const exist = await this.storesService.existStore({
            where: {
                user: {
                    id: user.id,
                },
            },
        });

        if (exist) {
            throw StoresException.ALREADY_HAS_STORE;
        }
    }
}
