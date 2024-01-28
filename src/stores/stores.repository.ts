import { Injectable, Logger } from '@nestjs/common';
import { Store } from './entity/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
    EntityManager,
    FindManyOptions,
    FindOptionsWhere,
    Repository,
    FindOptionsSelect,
    FindOptionsRelations,
} from 'typeorm';
import { StoreDetail } from './entity/store-detail.entity';
import { StoreApprove } from './entity/store-approve.entity';
import { BusinessDetail } from './entity/business-detail.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { User } from 'src/users/entity/user.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entity/category.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Menu } from 'src/menus/entity/menu.entity';
import { StoresException } from 'src/global/exception/stores-exception';
import { StoreApproveStatus } from './enum/store-approve-status.enum';

@Injectable()
export class StoresRepository {
    protected readonly logger = new Logger(StoresRepository.name);

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

    async findCategory(superId: number) {
        return await this.categoryService.findSubs(superId);
    }

    async saveStore(store: Store) {
        return await this.stores.save(store);
    }

    async findOneStore(
        where: FindOptionsWhere<Store>,
        select?: FindOptionsSelect<Store>,
        relations?: FindOptionsRelations<Store>,
    ) {
        return await this.stores.findOne({
            where,
            select,
            relations,
        });
    }

    async existStore(where: FindManyOptions<Store>) {
        return await this.stores.exist(where);
    }

    async findOneApprove(where: FindOptionsWhere<StoreApprove>) {
        return await this.storeApprove.findOneBy(where);
    }

    async updateStore(store: Store, partialEntity: QueryDeepPartialEntity<Store>) {
        await this.stores.update(store.id, partialEntity);
    }

    async approve(entity: StoreApprove) {
        await this.storeApprove.update(entity.id, {
            isApproved: StoreApproveStatus.DONE,
        });

        await this.entityManager
            .createQueryBuilder(StoreApprove, 'a')
            .leftJoinAndSelect(Store, 's', 's.id = a.store_id')
            .select('a.id AS id')
            .addSelect('a.isApproved As isApproved')
            .where('a.id = :id', { id: entity.id })
            .getRawMany();
    }

    async createStore(user: User, dto: CreateStoreDto) {
        const categories: Category[] = [];

        for (const categoryId of dto.categories) {
            categories.push(await this.findCategory(categoryId));
        }

        const newStore = this.stores.create({
            businessDetail: this.businessDetails.create({
                address: dto.address,
                businessNum: dto.businessNum,
                name: dto.businessLeaderName,
            }),
            detail: this.storeDetails.create({
                address: dto.address,
                addressDetail: dto.addressDetail ?? null,
                cookingTime: dto.cookingTime,
                operationTimes: dto.operationTimes,
            }),
            approve: this.storeApprove.create(),
            name: dto.name,
            tag: {
                id: 1,
            },
            user: user,
            categories,
        });

        await this.stores.save(newStore);
    }

    async findOrder(store: Store) {
        const storeDetailData = await this.storeDetails.findOne({ where: { store: { id: store.id } } });
        const order = storeDetailData.menuOrders;
        return order;
    }

    async processOrderBy(store: Store) {
        const processingOrder = await this.findOrder(store);
        if (!processingOrder) {
            return null;
        }
        let orderBy = 'FIELD(m.id, ';
        while (processingOrder.length > 1) {
            const menuId = processingOrder.pop();
            orderBy += menuId + ', ';
        }
        orderBy += processingOrder[0] + `)`; // 맨 마지막 id는 콤마를 붙여주면 안되니 별도로 추가
        return orderBy;
    }

    async addOrder(store: Store, menu: Menu) {
        const storeDetail = await this.storeDetails.findOne({ where: { store: { id: store.id } } });
        const newOrder = storeDetail.menuOrders ? storeDetail.menuOrders : [];
        newOrder.unshift(menu.id);
        const newProduct = {
            ...storeDetail,
            menuOrders: newOrder,
        };
        await this.storeDetails.save(newProduct);
    }

    async updateOrder(store: Store, order: number[]) {
        const storeDetail = await this.storeDetails.findOne({ where: { store: { id: store.id } } });
        const newOrder = { menuOrders: order };
        const newProduct = {
            ...storeDetail,
            ...newOrder,
        };
        await this.storeDetails.save(newProduct);
    }
}
