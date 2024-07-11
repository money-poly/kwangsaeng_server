import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { ExecuteQueryBuilderType } from 'src/global/common/execute-qb-type.enum';
import { SortFilterType } from './enum/sort-filter-type.enum';

@Injectable()
export class Menus2Repository {
    constructor(
        @InjectRepository(Menu)
        private readonly menus: Repository<Menu>,
        @InjectRepository(MenuView)
        private readonly menuView: Repository<MenuView>,
        private readonly entityManager: EntityManager,
    ) {}

    async sortInQb<T>(qb: SelectQueryBuilder<T>, type: SortFilterType) {
        switch (type) {
            case SortFilterType.DISCOUNT:
                return qb.orderBy('discount_rate', 'DESC');
            case SortFilterType.PRICE:
                return qb.orderBy('price', 'ASC');
            case SortFilterType.expire:
                return qb.orderBy('expired_date', 'DESC');
            case SortFilterType.popular:
                if (
                    // qb에 menuView가 이미 조인되어있는지 확인
                    qb.expressionMap.joinAttributes.map((entity) => entity.entityOrProperty).includes('menu.menuView')
                ) {
                    return qb.orderBy('mv.view_count', 'DESC');
                }
                return qb.leftJoin(MenuView, 'mv').orderBy('mv.view_count', 'DESC');
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
