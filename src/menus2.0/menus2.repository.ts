import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { ExecuteQueryBuilderType } from 'src/global/common/execute-qb-type.enum';
import { SortFilterType } from './enum/sort-filter-type.enum';
import { Store } from 'src/stores/entity/store.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { addWhereCondition } from 'src/global/util/isWhereCondition';
import { MenusException } from 'src/global/exception/menus-exception';
import { Category } from 'src/categories/entity/category.entity';
import { MenuStatus } from 'src/menus/enum/menu-status.enum';
import { getUTCTime } from './util/get-utc-time';

@Injectable()
export class Menus2Repository {
    constructor(
        @InjectRepository(Menu)
        private readonly menus: Repository<Menu>,
        @InjectRepository(MenuView)
        private readonly menuView: Repository<MenuView>,
        private readonly entityManager: EntityManager,
    ) {}

    async todayUsingFoodExpensesLogic<T>(qb: SelectQueryBuilder<T>, amount: number) {
        addWhereCondition(qb, 'm.selling_price < :amount', { amount });
        return qb
            .select('m.id', 'menuId')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('m.name', 'menuName')
            .addSelect('m.price', 'price')
            .addSelect('m.selling_price', 'sellingPrice')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.count', 'count')
            .addSelect('mv.view_count', 'viewCount')
            .addSelect('s.id', 'storeId')
            .addSelect('s.name', 'storeName');
    }

    async onSaleLogic<T>(qb: SelectQueryBuilder<T>) {
        addWhereCondition(qb, 'm.discount_rate > :rate', { rate: 0 });
        return qb
            .select('m.id', 'menuId')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('m.name', 'menuName')
            .addSelect('m.price', 'price')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.selling_price', 'sellingPrice')
            .addSelect('m.count', 'count')
            .addSelect('mv.view_count', 'viewCount')
            .addSelect('s.id', 'storeId')
            .addSelect('s.name', 'storeName');
    }

    async lastItemLogic<T>(qb: SelectQueryBuilder<T>) {
        addWhereCondition(qb, 'm.count = :count', { count: 1 });
        return qb
            .select('m.id', 'menuId')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('m.name', 'menuName')
            .addSelect('m.price', 'price')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.selling_price', 'sellingPrice')
            .addSelect('s.id', 'storeId')
            .addSelect('s.name', 'storeName')
            .addSelect('m.count', 'count');
    }

    async lowStockLogic<T>(qb: SelectQueryBuilder<T>, category: string) {
        addWhereCondition(qb, 'c.name = :name', { name: category });
        return qb
            .select('m.id', 'menuId')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('m.name', 'menuName')
            .addSelect('m.price', 'price')
            .addSelect('m.selling_price', 'sellingPrice')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.count', 'count')
            .addSelect('mv.view_count', 'viewCount')
            .addSelect('s.id', 'storeId')
            .addSelect('s.name', 'storeName');
    }

    async upcomingSalesLogic<T>(qb: SelectQueryBuilder<T>) {
        const date = getUTCTime();
        addWhereCondition(qb, 'm.prearranged_sale_time BETWEEN :now AND :prearragedTime', {
            now: date.now,
            prearragedTime: date.threeHoursLater,
        });
        addWhereCondition(qb, 'm.status = :status', { status: MenuStatus.PREARRANGED });
        return qb
            .select('m.id', 'menuId')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('m.name', 'menuName')
            .addSelect('m.price', 'price')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.selling_price', 'sellingPrice')
            .addSelect('s.id', 'storeId')
            .addSelect('s.name', 'storeName')
            .addSelect('m.count', 'count')
            .addSelect('mv.view_count', 'viewCount')
            .addSelect('m.prearrangedSaleTime', 'saleTime')
            .orderBy('m.prearranged_sale_time', 'ASC');
    }

    async createQueryBuilder() {
        return this.entityManager.createQueryBuilder(Menu, 'm');
    }

    async leftJoinMenuView<T>(qb: SelectQueryBuilder<T>) {
        return qb.leftJoinAndSelect(MenuView, 'mv', 'm.id = mv.menu_id');
    }

    async leftJoinStore<T>(qb: SelectQueryBuilder<T>) {
        return qb.leftJoinAndSelect(Store, 's', 'm.store_id = s.id');
    }

    async leftJoinStoreDetail<T>(qb: SelectQueryBuilder<T>) {
        return qb.leftJoinAndSelect(StoreDetail, 'sd', 's.id = sd.store_id');
    }

    async leftJoinCategories<T>(qb: SelectQueryBuilder<T>) {
        return qb
            .leftJoinAndSelect('store_categories', 'sc', 'm.store_id = sc.stores_id')
            .leftJoinAndSelect(Category, 'c', 'sc.categories_id = c.id');
    }

    async filterDistance<T>(qb: SelectQueryBuilder<T>, lat: number, lon: number) {
        return addWhereCondition(
            qb,
            'ST_DWithin(ST_Transform(ST_SetSRID(ST_MakePoint("sd"."lon", "sd"."lat"), 4326), 3857), ST_Transform(ST_SetSRID(ST_MakePoint(:longitude::numeric, :latitude::numeric), 4326), 3857), :range)',
            { longitude: lon, latitude: lat, range: 3000 },
        );
    }

    async sortInQb<T>(qb: SelectQueryBuilder<T>, type: SortFilterType) {
        switch (type) {
            case SortFilterType.DISCOUNT:
                qb.orderBy('discount_rate', 'DESC');
                break;
            case SortFilterType.PRICE:
                qb.orderBy('price', 'ASC');
                break;
            case SortFilterType.EXPIRE:
                qb.orderBy('expired_date', 'DESC');
                break;
            case SortFilterType.POPULAR:
                // qb에 menuView가 이미 조인되어있는지 확인
                const isJoin: any = qb.expressionMap.joinAttributes
                    .map((entity) => entity.entityOrProperty)
                    .includes(MenuView);
                if (!isJoin) {
                    qb.leftJoin(MenuView, 'mv', 'm.id = mv.menu_id');
                }
                qb.orderBy('mv.view_count', 'DESC');
                break;
            default:
                throw MenusException.FILTER_TYPE_NOT_FOUND;
        }
        return qb.addOrderBy('m.id', 'ASC');
    }

    async settingOffset<T>(qb: SelectQueryBuilder<T>, offset: number) {
        return qb.offset(offset);
    }

    async settingLimit<T>(qb: SelectQueryBuilder<T>, limit: number) {
        return qb.limit(limit);
    }

    async cursorPagination<T>(qb: SelectQueryBuilder<T>, type: SortFilterType, lastId: number, lastValue: string) {
        await this.settingLimit(qb, 12);
        addWhereCondition(qb, 'm.id > :id', { id: lastId });
        switch (type) {
            case SortFilterType.DISCOUNT:
                return qb.andWhere('discount_rate <= :rate', { rate: lastValue });
            case SortFilterType.PRICE:
                return qb.andWhere('selling_price >= :price', { price: lastValue });
            case SortFilterType.EXPIRE:
                return qb.andWhere('expired_date <= :date', { date: lastValue });
            case SortFilterType.POPULAR:
                // qb에 menuView가 이미 조인되어있는지 확인
                const isJoin: any = qb.expressionMap.joinAttributes
                    .map((entity) => entity.entityOrProperty)
                    .includes(MenuView);
                if (!isJoin) {
                    return qb.leftJoin(MenuView, 'mv', 'm.id = mv.menu_id');
                }
                return qb.andWhere('mv.view_count <= count', { count: lastValue });
        }
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
