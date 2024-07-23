import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { Store } from 'src/stores/entity/store.entity';
import { EntityManager, Repository } from 'typeorm';

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
}
