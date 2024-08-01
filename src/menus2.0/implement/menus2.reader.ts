import { Injectable } from '@nestjs/common';
import { Menus2Repository } from '../menus2.repository';
import { SortFilterType } from '../enum/sort-filter-type.enum';
import { ExecuteQueryBuilderType } from 'src/global/common/execute-qb-type.enum';
import { MenuCategories } from '../enum/categories.enum';
import { translateCategory } from '../util/translate-category';

@Injectable()
export class Menus2Reader {
    constructor(private readonly menusRepository: Menus2Repository) {}

    async readTodayUsingFoodExpenses(amount: number, type: SortFilterType, final: boolean, lat: number, lon: number) {
        const qb = await this.menusRepository.createQueryBuilder();
        let totalCount;

        await this.menusRepository
            .leftJoinMenuView(qb)
            .then((qb) => this.menusRepository.leftJoinStore(qb))
            .then((qb) => this.menusRepository.leftJoinStoreDetail(qb))
            .then((qb) => this.menusRepository.filterDistance(qb, lat, lon))
            .then((qb) => this.menusRepository.sortInQb(qb, type))
            .then((qb) => this.menusRepository.todayUsingFoodExpensesLogic(qb, amount))
            .then(async (qb) => {
                totalCount = await this.menusRepository.getTotalCount(qb);
                return qb;
            })
            .then((qb) => {
                if (final) {
                    return this.menusRepository.settingOffset(qb, 6);
                } else {
                    return this.menusRepository.settingLimit(qb, 6);
                }
            });

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return { menus: executingQuery, totalCount };
    }

    async readOnSale(type: SortFilterType, lat: number, lon: number, lastId?: number, lastValue?: string) {
        const qb = await this.menusRepository.createQueryBuilder();
        let totalCount;

        await this.menusRepository
            .leftJoinMenuView(qb)
            .then((qb) => this.menusRepository.leftJoinStore(qb))
            .then((qb) => this.menusRepository.leftJoinStoreDetail(qb))
            .then((qb) => this.menusRepository.filterDistance(qb, lat, lon))
            .then((qb) => this.menusRepository.sortInQb(qb, type))
            .then((qb) => this.menusRepository.onSaleLogic(qb))
            .then(async (qb) => {
                totalCount = await this.menusRepository.getTotalCount(qb);
                return qb;
            })
            .then((qb) => {
                if (lastId && lastValue) {
                    return this.menusRepository.cursorPagination(qb, type, lastId, lastValue);
                } else {
                    return this.menusRepository.settingLimit(qb, 6);
                }
            });

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return { menus: executingQuery, totalCount };
    }

    async readLastItem(lat: number, lon: number, final?: boolean) {
        const qb = await this.menusRepository.createQueryBuilder();

        await this.menusRepository
            .leftJoinMenuView(qb)
            .then((qb) => this.menusRepository.leftJoinStore(qb))
            .then((qb) => this.menusRepository.leftJoinStoreDetail(qb))
            .then((qb) => this.menusRepository.filterDistance(qb, lat, lon))
            .then((qb) => this.menusRepository.lastItemLogic(qb))
            .then((qb) => {
                if (final) {
                    return this.menusRepository.settingOffset(qb, 2);
                } else {
                    return this.menusRepository.settingLimit(qb, 2);
                }
            });

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return { menus: executingQuery };
    }

    async readLowStock(
        type: SortFilterType,
        category: MenuCategories,
        lat: number,
        lon: number,
        lastId?: number,
        lastValue?: string,
    ) {
        const qb = await this.menusRepository.createQueryBuilder();
        const translatedCategory = translateCategory(category);
        let totalCount;

        await this.menusRepository
            .leftJoinMenuView(qb)
            .then((qb) => this.menusRepository.leftJoinStore(qb))
            .then((qb) => this.menusRepository.leftJoinStoreDetail(qb))
            .then((qb) => this.menusRepository.leftJoinCategories(qb))
            .then((qb) => this.menusRepository.filterDistance(qb, lat, lon))
            .then((qb) => this.menusRepository.sortInQb(qb, type))
            .then((qb) => this.menusRepository.lowStockLogic(qb, translatedCategory))
            .then(async (qb) => {
                totalCount = await this.menusRepository.getTotalCount(qb);
                return qb;
            })
            .then((qb) => {
                if (lastId && lastValue) {
                    return this.menusRepository.cursorPagination(qb, type, lastId, lastValue);
                } else {
                    return this.menusRepository.settingLimit(qb, 6);
                }
            });

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return { menus: executingQuery, totalCount };
    }

    async readUpcomingSales(lat: number, lon: number) {
        const qb = await this.menusRepository.createQueryBuilder();

        await this.menusRepository
            .leftJoinMenuView(qb)
            .then((qb) => this.menusRepository.leftJoinStore(qb))
            .then((qb) => this.menusRepository.leftJoinStoreDetail(qb))
            .then((qb) => this.menusRepository.leftJoinCategories(qb))
            .then((qb) => this.menusRepository.filterDistance(qb, lat, lon))
            .then((qb) => this.menusRepository.upcomingSalesLogic(qb));

        const executingQuery = await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
        return executingQuery;
    }
}
