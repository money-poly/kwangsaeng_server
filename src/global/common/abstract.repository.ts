import { Logger } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
    EntityManager,
    EntityTarget,
    FindOptionsRelations,
    FindOptionsSelect,
    FindOptionsWhere,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { Store } from 'src/stores/entity/store.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Menu } from 'src/menus/entity/menu.entity';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { Category } from 'src/categories/entity/category.entity';
import { ExecuteQueryBuilderType } from './execute-qb-type.enum';
import { QueryBuilderUtil } from '../util/query-builder.util';
import { OrderDetail } from 'src/orders/entity/order-detail.entity';
import { Order } from 'src/orders/entity/order.entity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
    protected abstract readonly logger: Logger;

    constructor(
        private readonly entityRepository: Repository<T>,
        private readonly entityManager: EntityManager,
    ) {}

    async exists(where: FindOptionsWhere<T>): Promise<boolean> {
        return this.entityRepository.exists({ where });
    }

    async create(entity: T): Promise<T> {
        return this.entityRepository.save(entity);
    }

    async findOne(
        where: FindOptionsWhere<T>,
        select?: FindOptionsSelect<T>,
        relations?: FindOptionsRelations<T>,
    ): Promise<T> {
        const entity = await this.entityRepository.findOne({ select, where, relations });

        return entity;
    }

    async findMany(where: FindOptionsWhere<T>, select?: FindOptionsSelect<T>, relations?: FindOptionsRelations<T>) {
        return await this.entityRepository.find({
            where,
            select,
            relations,
        });
    }

    async findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T> {
        const updateResult = await this.entityRepository.update(where, partialEntity);

        return this.findOne(where);
    }

    async find(where?: FindOptionsWhere<T>) {
        return this.entityRepository.findBy(where);
    }

    async findOneAndDelete(where: FindOptionsWhere<T>) {
        await this.entityRepository.softDelete(where);
    }

    leftJoinMenuView<Menu>(qb: SelectQueryBuilder<Menu>) {
        return qb.leftJoinAndSelect(MenuView, 'mv', 'm.id = mv.menu_id');
    }

    leftJoinStoreToMenu<Menu>(qb: SelectQueryBuilder<Menu>) {
        return qb.leftJoinAndSelect(Store, 's', 'm.store_id = s.id');
    }

    leftJoinCategoriesToMenu<Menu>(qb: SelectQueryBuilder<Menu>) {
        return qb
            .leftJoinAndSelect('store_categories', 'sc', 'm.store_id = sc.stores_id')
            .leftJoinAndSelect(Category, 'c', 'sc.categories_id = c.id');
    }

    leftJoinStoreDetail<Store>(qb: SelectQueryBuilder<Store>) {
        return qb.leftJoinAndSelect(StoreDetail, 'sd', 's.id = sd.store_id');
    }

    leftJoinOrderDetail<Order>(qb: SelectQueryBuilder<Order>) {
        return qb.leftJoinAndSelect(OrderDetail, 'od', 'o.id = od.order_id');
    }

    settingOffset<T>(qb: SelectQueryBuilder<T>, offset: number) {
        return qb.offset(offset);
    }

    settingLimit<T>(qb: SelectQueryBuilder<T>, limit: number) {
        return qb.limit(limit);
    }

    filterDistance<T>(qb: SelectQueryBuilder<T>, lat: number, lon: number) {
        return QueryBuilderUtil.addWhereCondition(
            qb,
            'ST_DWithin(ST_Transform(ST_SetSRID(ST_MakePoint("sd"."lon", "sd"."lat"), 4326), 3857), ST_Transform(ST_SetSRID(ST_MakePoint(:longitude::numeric, :latitude::numeric), 4326), 3857), :range)',
            { longitude: lon, latitude: lat, range: 3000 },
        );
    }

    createQueryBuilder<E extends T>(entityClass: EntityTarget<E>): SelectQueryBuilder<E> {
        console.log(entityClass);
        let alias;
        switch (entityClass) {
            case Menu:
                alias = 'm';
                break;
            case Store:
                alias = 's';
                break;
            case MenuView:
                alias = 'mv';
                break;
            case StoreDetail:
                alias = 'sd';
                break;
            case StoreApprove:
                alias = 'sa';
                break;
            case Order:
                alias = 'o';
                break;
        }
        return this.entityManager.createQueryBuilder(entityClass, alias);
    }

    async getTotalCount<T>(qb: SelectQueryBuilder<T>) {
        return qb.getCount();
    }

    async executeQueryBuilder<T>(qb: SelectQueryBuilder<T>, type: ExecuteQueryBuilderType) {
        switch (type) {
            case ExecuteQueryBuilderType.MANY:
                return qb.getRawMany();
            case ExecuteQueryBuilderType.ONE:
                return qb.getRawOne();
        }
    }
}
