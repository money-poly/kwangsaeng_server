import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { ExecuteQueryBuilderType } from 'src/global/common/execute-qb-type.enum';
import { SortFilterType } from './enum/sort-filter-type.enum';
import { Store } from 'src/stores/entity/store.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';

@Injectable()
export class Menus2Repository {
    constructor(
        @InjectRepository(Menu)
        private readonly menus: Repository<Menu>,
        @InjectRepository(MenuView)
        private readonly menuView: Repository<MenuView>,
        private readonly entityManager: EntityManager,
    ) {}

    async todayUsedFoodExpensesLogic<T>(qb: SelectQueryBuilder<T>, amount: number, final: boolean) {
        if (final) {
            qb.limit(6);
        } else {
            qb.offset(6);
        }
        // TODO) store을 Join하는 부분에 대해서 어떻게 생각하는지
        return qb
            .select('m.id', 'menuId')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('m.name', 'menuName')
            .addSelect('m.price', 'price')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.count', 'count')
            .addSelect('mv.view_count', 'viewCount')
            .addSelect('s.id', 'storeId')
            .addSelect('s.name', 'storeName')
            .where('m.selling_price < :amount', { amount });
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

    async filterDistance<T>(qb: SelectQueryBuilder<T>, lat: number, lon: number) {
        return qb.where(
            'ST_DWithin(ST_SetSRID(ST_MakePoint(sd.lon, sd.lat), 4326), ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), :range)',
            { longitude: lon, latitude: lat, range: 3000 },
        );
    }

    async sortInQb<T>(qb: SelectQueryBuilder<T>, type: SortFilterType) {
        switch (type) {
            case SortFilterType.DISCOUNT:
                return qb.orderBy('discount_rate', 'DESC');
            case SortFilterType.PRICE:
                return qb.orderBy('price', 'ASC');
            case SortFilterType.expire:
                return qb.orderBy('expired_date', 'DESC');
            case SortFilterType.popular:
                // qb에 menuView가 이미 조인되어있는지 확인
                const isJoin: any = qb.expressionMap.joinAttributes
                    .map((entity) => entity.entityOrProperty)
                    .includes(MenuView);
                if (isJoin) {
                    return qb.orderBy('mv.view_count', 'DESC');
                }
                return qb.leftJoin(MenuView, 'mv', 'm.id = mv.menu_id').orderBy('mv.view_count', 'DESC');
        }
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
