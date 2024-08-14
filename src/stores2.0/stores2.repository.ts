import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { AbstractRepository } from 'src/global/common/abstract.repository';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { Store } from 'src/stores/entity/store.entity';
import { StoreApproveStatus } from 'src/stores/enum/store-approve-status.enum';
import { StoreStatus } from 'src/stores/enum/store-status.enum';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class Stores2Repository extends AbstractRepository<Store> {
    protected readonly logger = new Logger(Stores2Repository.name);

    constructor(
        @InjectRepository(Store)
        private readonly stores: Repository<Store>,
        @InjectRepository(StoreDetail)
        private readonly storeDetails: Repository<StoreDetail>,
        @InjectRepository(StoreApprove)
        private readonly storeApprove: Repository<StoreApprove>,
        @InjectRepository(BusinessDetail)
        private readonly businessDetails: Repository<BusinessDetail>,
        private readonly categoryService: CategoriesService,
        entityManager: EntityManager,
    ) {
        super(stores, entityManager);
    }

    async checkApprove(store: Store): Promise<boolean> {
        return await this.storeApprove.exists({
            where: {
                store: {
                    id: store.id,
                },
                isApproved: StoreApproveStatus.DONE,
            },
        });
    }

    async checkOpen(store: Store): Promise<boolean> {
        return await this.stores.exists({
            where: {
                id: store.id,
                status: StoreStatus.OPEN,
            },
        });
    }
}
