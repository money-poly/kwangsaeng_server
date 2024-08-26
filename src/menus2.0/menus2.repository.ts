import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { SortFilterType } from './enum/sort-filter-type.enum';
import { Store } from 'src/stores/entity/store.entity';
import { MenusException } from 'src/global/exception/menus-exception';
import { MenuStatus } from 'src/menus/enum/menu-status.enum';
import { TimeUtil } from 'src/global/util/time.util';
import { AbstractRepository } from 'src/global/common/abstract.repository';

@Injectable()
export class Menus2Repository extends AbstractRepository<Menu> {
    protected readonly logger = new Logger(Menus2Repository.name);

    constructor(
        @InjectRepository(Menu)
        private readonly menus: Repository<Menu>,
        @InjectRepository(MenuView)
        private readonly menuView: Repository<MenuView>,
        entityManager: EntityManager,
    ) {
        super(menus, entityManager);
    }

    todayUsingFoodExpensesLogic(qb: SelectQueryBuilder<Menu>, amount: number) {
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
            .addSelect('s.name', 'storeName')
            .andWhere('m.selling_price < :amount', { amount });
    }

    onSaleLogic(qb: SelectQueryBuilder<Menu>) {
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
            .addSelect('s.name', 'storeName')
            .andWhere('m.discount_rate > :rate', { rate: 0 });
    }

    lastItemLogic(qb: SelectQueryBuilder<Menu>) {
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
            .andWhere('m.count = :count', { count: 1 });
    }

    lowStockLogic(qb: SelectQueryBuilder<Menu>) {
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

    upcomingSalesLogic(qb: SelectQueryBuilder<Menu>) {
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
            .andWhere('m.prearranged_sale_time BETWEEN :now AND :prearragedTime', {
                now: TimeUtil.getISOTime(),
                prearragedTime: TimeUtil.getISOTimeForThreeHoursLater(),
            })
            .andWhere('m.status = :status', { status: MenuStatus.PREARRANGED })
            .orderBy('m.prearranged_sale_time', 'ASC');
    }

    readInOrdeThroughStoreLogic(qb: SelectQueryBuilder<Menu>, store: Store, orderBy: string) {
        return qb
            .select('m.id', 'id')
            .addSelect('m.name', 'name')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.selling_price', 'sellingPrice')
            .addSelect('m.description', 'description')
            .addSelect('m.price', 'price')
            .addSelect('m.status', 'status')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('m.country_of_origin', 'countryOfOrigin')
            .where('m.store_id = :storeId', { storeId: store.id })
            .andWhere('m.status != :status', { status: MenuStatus.HIDDEN })
            .orderBy(orderBy, 'DESC');
    }

    readDiscountScheduleLogic(qb: SelectQueryBuilder<Menu>, store: Store) {
        const subQb = this.createQueryBuilder(Menu)
            .select('MIN(m.prearranged_sale_time)', 'prearrangedSaleTime')
            .where('m.store_id = :storeId', { storeId: store.id })
            .andWhere('m.status = :status', { status: MenuStatus.PREARRANGED });

        return qb
            .select('m.id', 'id')
            .addSelect('m.name', 'name')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.selling_price', 'sellingPrice')
            .addSelect('m.price', 'price')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('m.count', 'count')
            .addSelect('m.prearranged_sale_time', 'prearrangedSaleTime')
            .where('m.store_id = :storeId', { storeId: store.id })
            .andWhere('m.status = :status', { status: MenuStatus.PREARRANGED })
            .andWhere('m.prearranged_sale_time = (' + subQb.getQuery() + ')');
    }

    readTopOrdersLogic(qb: SelectQueryBuilder<Menu>, menusId: string) {
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
            .where(`m.id IN (${menusId})`);
    }

    filterCategory(qb: SelectQueryBuilder<Menu>, translatedCategory: string) {
        if (translatedCategory === 'all') {
            return qb;
        }
        return qb.andWhere('c.name = :name', { name: translatedCategory });
    }

    sortInQb(qb: SelectQueryBuilder<Menu>, type: SortFilterType) {
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

    cursorPagination(qb: SelectQueryBuilder<Menu>, type: SortFilterType, lastId: number, lastValue: string) {
        this.settingLimit(qb, 12);
        qb = qb.andWhere('m.id > :id', { id: lastId });
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

    async updateStatusToPrearrangedSale(menus: Menu[]) {
        menus.forEach(async (menu) => {
            await this.menus.update({ id: menu.id }, { status: MenuStatus.SALE, prearrangedSaleTime: null });
        });
    }
}
