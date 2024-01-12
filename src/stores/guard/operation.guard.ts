import { StoresRepository } from 'src/stores/stores.repository';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { StoresException } from 'src/global/exception/stores-exception';
import { StoreApproveStatus } from '../enum/store-approve-status.enum';

@Injectable()
export class OperationGuard implements CanActivate {
    constructor(private readonly storesRepository: StoresRepository) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const storeId = request.params.storeId;

        const approve = await this.storesRepository.findOneApprove({
            store: {
                id: storeId,
            },
        });

        if (!approve) {
            throw StoresException.ENTITY_NOT_FOUND;
        }

        if (approve.isApproved == StoreApproveStatus.DONE) {
            return true;
        } else {
            throw StoresException.NOT_APPROVED;
        }
    }
}
