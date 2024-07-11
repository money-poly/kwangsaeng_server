import { Injectable } from '@nestjs/common';
import { Menus2Repository } from '../menus2.repository';
import { SortFilterType } from '../enum/sort-filter-type.enum';
import { ExecuteQueryBuilderType } from 'src/global/common/execute-qb-type.enum';

@Injectable()
export class Menus2Reader {
    constructor(private readonly menusRepository: Menus2Repository) {}

    async readTodayUsedFoodExpenses(amount: number, filter: SortFilterType, final: boolean, lat: number, lon: number) {
        const qb = await this.menusRepository.createQueryBuilder();

        await this.menusRepository
            .leftJoinMenuView(qb)
            .then((qb) => this.menusRepository.leftJoinStore(qb))
            .then((qb) => this.menusRepository.leftJoinStoreDetail(qb))
            .then((qb) => this.menusRepository.filterDistance(qb, lat, lon))
            .then((qb) => this.menusRepository.sortInQb(qb, filter))
            .then((qb) => this.menusRepository.todayUsedFoodExpensesLogic(qb, amount, final));

        return await this.menusRepository.executeQueryBuilder(qb, ExecuteQueryBuilderType.MANY);
    }
}
