import { StoresException } from 'src/global/exception/stores-exception';
import { CreateStoreDto } from '../dto/create-store.dto';
import { StoresService } from '../stores.service';
import { Injectable, PipeTransform } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class CreateStoreUserValidationPipe implements PipeTransform {
    constructor(private readonly storesService: StoresService) {}

    async transform(user: User) {
        await this.validationUser(user);

        return user;
    }

    async validationUser(user: User) {
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
