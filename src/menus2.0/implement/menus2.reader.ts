import { Injectable } from '@nestjs/common';
import { Menus2Repository } from '../menus2.repository';
import { SortFilterType } from '../enum/sort-filter-type.enum';
import { ExecuteQueryBuilderType } from 'src/global/common/execute-qb-type.enum';

@Injectable()
export class Menus2Reader {
    constructor(private readonly menusRepository: Menus2Repository) {}

    async readTodayUsedFoodExpenses(amount: number, filter: SortFilterType, final: boolean, lat: number, lon: number) {
        const qb = await this.menusRepository.createQueryBuilder();
        let totalCount;

        await this.menusRepository
            .leftJoinMenuView(qb)
            .then((qb) => this.menusRepository.leftJoinStore(qb))
            .then((qb) => this.menusRepository.leftJoinStoreDetail(qb))
            .then((qb) => this.menusRepository.filterDistance(qb, lat, lon))
            .then((qb) => this.menusRepository.sortInQb(qb, filter))
            .then((qb) => this.menusRepository.todayUsedFoodExpensesLogic(qb, amount))
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
}
