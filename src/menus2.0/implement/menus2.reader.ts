import { Injectable } from '@nestjs/common';
import { LessThanOrEqual } from 'typeorm';
import { Menus2Repository } from '../menus2.repository';
import { SortFilterType } from '../enum/sort-filter-type.enum';
import { ExecuteQueryBuilderType } from 'src/global/common/execute-qb-type.enum';
import { MenuCategories } from '../enum/categories.enum';
import { MenuStatus } from 'src/menus/enum/menu-status.enum';
import { TimeUtil } from 'src/global/util/time.util';
import { CategoryUtil } from '../util/translate-category.util';
import { Store } from 'src/stores/entity/store.entity';
import { ProcessOrderUtil } from '../util/process-order.util';
import { Stores2Reader } from 'src/stores2.0/implement/stores2.reader';
import { Menu } from 'src/menus/entity/menu.entity';
import { OrdersReader } from 'src/orders/implement/orders.reader';

@Injectable()
export class Menus2Reader {
    constructor(
        private readonly menusRepository: Menus2Repository,
        private readonly storesReader: Stores2Reader,
        private readonly ordersReader: OrdersReader,
    ) {}

    async readTodayUsingFoodExpenses(amount: number, type: SortFilterType, final: boolean, lat: number, lon: number) {
        let qb = this.menusRepository.createQueryBuilder(Menu);

        qb = this.menusRepository.leftJoinMenuView(qb);
        qb = this.menusRepository.leftJoinStoreToMenu(qb);
        qb = this.menusRepository.leftJoinStoreDetail(qb);
        qb = this.menusRepository.filterDistance(qb, lat, lon);
        qb = this.menusRepository.sortInQb(qb, type);
        qb = this.menusRepository.todayUsingFoodExpensesLogic(qb, amount);

        const totalCount = await this.menusRepository.getTotalCount(qb);

        if (final) {
            qb = this.menusRepository.settingOffset(qb, 6);
        } else {
            qb = this.menusRepository.settingLimit(qb, 6);
        }

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return { menus: executingQuery, totalCount };
    }

    async readOnSale(type: SortFilterType, lat: number, lon: number, lastId?: number, lastValue?: string) {
        let qb = this.menusRepository.createQueryBuilder(Menu);

        qb = this.menusRepository.leftJoinMenuView(qb);
        qb = this.menusRepository.leftJoinStoreToMenu(qb);
        qb = this.menusRepository.leftJoinStoreDetail(qb);
        qb = this.menusRepository.filterDistance(qb, lat, lon);
        qb = this.menusRepository.sortInQb(qb, type);
        qb = this.menusRepository.onSaleLogic(qb);

        const totalCount = await this.menusRepository.getTotalCount(qb);

        if (lastId && lastValue) {
            qb = this.menusRepository.cursorPagination(qb, type, lastId, lastValue);
        } else {
            qb = this.menusRepository.settingLimit(qb, 6);
        }

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return { menus: executingQuery, totalCount };
    }

    async readLastItem(lat: number, lon: number, final?: boolean) {
        let qb = this.menusRepository.createQueryBuilder(Menu);

        qb = this.menusRepository.leftJoinMenuView(qb);
        qb = this.menusRepository.leftJoinStoreToMenu(qb);
        qb = this.menusRepository.leftJoinStoreDetail(qb);
        qb = this.menusRepository.filterDistance(qb, lat, lon);
        qb = this.menusRepository.lastItemLogic(qb);

        if (final) {
            qb = this.menusRepository.settingOffset(qb, 2);
        } else {
            qb = this.menusRepository.settingLimit(qb, 2);
        }

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return { menus: executingQuery };
    }

    async readLowStock(
        type: SortFilterType,
        category: MenuCategories | 'all',
        lat: number,
        lon: number,
        lastId?: number,
        lastValue?: string,
    ) {
        let qb = this.menusRepository.createQueryBuilder(Menu);
        const translatedCategory = CategoryUtil.translateCategory(category);

        qb = this.menusRepository.leftJoinMenuView(qb);
        qb = this.menusRepository.leftJoinStoreToMenu(qb);
        qb = this.menusRepository.leftJoinStoreDetail(qb);
        qb = this.menusRepository.leftJoinCategoriesToMenu(qb);
        qb = this.menusRepository.filterDistance(qb, lat, lon);
        qb = this.menusRepository.sortInQb(qb, type);
        qb = this.menusRepository.filterCategory(qb, translatedCategory);
        qb = this.menusRepository.lowStockLogic(qb);

        const totalCount = await this.menusRepository.getTotalCount(qb);

        if (lastId && lastValue) {
            qb = this.menusRepository.cursorPagination(qb, type, lastId, lastValue);
        } else {
            qb = this.menusRepository.settingLimit(qb, 6);
        }

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return { menus: executingQuery, totalCount };
    }

    async readUpcomingSales(lat: number, lon: number) {
        let qb = this.menusRepository.createQueryBuilder(Menu);

        qb = this.menusRepository.leftJoinMenuView(qb);
        qb = this.menusRepository.leftJoinStoreToMenu(qb);
        qb = this.menusRepository.leftJoinStoreDetail(qb);
        qb = this.menusRepository.leftJoinCategoriesToMenu(qb);
        qb = this.menusRepository.filterDistance(qb, lat, lon);
        qb = this.menusRepository.upcomingSalesLogic(qb);

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return executingQuery;
    }

    async readPrearrangedSale() {
        return await this.menusRepository.findMany(
            { status: MenuStatus.PREARRANGED, prearrangedSaleTime: LessThanOrEqual(TimeUtil.getKSTTime()) },
            { id: true, status: true },
        );
    }

    async readInOrdeThroughStore(store: Store) {
        const menuOrder = store.detail.menuOrders.join();
        if (!menuOrder) {
            return null;
        }

        const orderBy = ProcessOrderUtil.refine(menuOrder);

        let qb = this.menusRepository.createQueryBuilder(Menu);

        qb = this.menusRepository.readInOrdeThroughStoreLogic(qb, store, orderBy);

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return executingQuery;
    }

    async readDiscountSchedule(store: Store) {
        let qb = this.menusRepository.createQueryBuilder(Menu);

        qb = this.menusRepository.leftJoinStoreToMenu(qb);
        qb = this.menusRepository.leftJoinStoreDetail(qb);
        qb = this.menusRepository.readDiscountScheduleLogic(qb, store);

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return executingQuery;
    }

    async readTopOrders(
        type: SortFilterType,
        lat: number,
        lon: number,
        category: MenuCategories | 'all',
        lastId?: number,
        lastValue?: string,
    ) {
        const translatedCategory = CategoryUtil.translateCategory(category);
        const menus = await this.ordersReader.readTopOrderMenus();
        const menuIds = menus.map((item) => item.menu_id);
        const refinedMenus = menuIds.map((id) => `'${id}'`).join(', ');

        let qb = this.menusRepository.createQueryBuilder(Menu);

        qb = this.menusRepository.leftJoinMenuView(qb);
        qb = this.menusRepository.leftJoinStoreToMenu(qb);
        qb = this.menusRepository.leftJoinStoreDetail(qb);
        qb = this.menusRepository.filterDistance(qb, lat, lon);
        qb = this.menusRepository.filterCategory(qb, translatedCategory);
        qb = this.menusRepository.readTopOrdersLogic(qb, refinedMenus);

        if (lastId && lastValue) {
            qb = this.menusRepository.cursorPagination(qb, type, lastId, lastValue);
        } else {
            qb = this.menusRepository.settingLimit(qb, 6);
        }

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return executingQuery;
    }
}
