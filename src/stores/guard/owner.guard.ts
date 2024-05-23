import { StoresRepository } from 'src/stores/stores.repository';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { StoresException } from 'src/global/exception/stores-exception';
import { Seller } from 'src/users/entity/seller.entity';

interface RequestUser extends Request {
    user: Seller;
}

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(private readonly storesRepository: StoresRepository) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: RequestUser = context.switchToHttp().getRequest();
        const storeId = parseInt(request.params.storeId);
        const user = request.user;

        const store = await this.storesRepository.findOneStore({
            id: storeId,
        });

        if (!store) {
            throw StoresException.ENTITY_NOT_FOUND;
        }

        const owner = await store.user;

        if (owner.id != user.id) {
            throw StoresException.HAS_NO_PERMISSIONS;
        }

        return true;
    }
}
