import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { Store } from 'src/stores/entity/store.entity';
import { StoreApproveStatus } from 'src/stores/enum/store-approve-status.enum';
import { StoreStatus } from 'src/stores/enum/store-status.enum';
import {
    EntityManager,
    FindOptionsRelations,
    FindOptionsSelect,
    FindOptionsWhere,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class Stores2Repository {
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
        public entityManager: EntityManager,
    ) {}

    async findOne(
        where: FindOptionsWhere<Store>,
        select?: FindOptionsSelect<Store>,
        relations?: FindOptionsRelations<Store>,
    ): Promise<Store> {
        return await this.stores.findOne({
            where,
            select,
            relations,
        });
    }

    async findMany(
        where: FindOptionsWhere<Store>,
        select?: FindOptionsSelect<Store>,
        relations?: FindOptionsRelations<Store>,
    ): Promise<Store[]> {
        return await this.stores.find({
            where,
            select,
            relations,
        });
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

    async leftJoinStoreToMenu<Menu>(qb: SelectQueryBuilder<Menu>) {
        return qb.leftJoinAndSelect(Store, 's', 'm.store_id = s.id');
    }

    async leftJoinStoreDetail<Store>(qb: SelectQueryBuilder<Store>) {
        return qb.leftJoinAndSelect(StoreDetail, 'sd', 's.id = sd.store_id');
    }
}
