import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { ExecuteQueryBuilderType } from 'src/global/common/execute-qb-type.enum';
import { SortFilterType } from './enum/discounte-filter-type.enum';

@Injectable()
export class Menus2Repository {
    constructor(
        @InjectRepository(Menu)
        private readonly menus: Repository<Menu>,
        @InjectRepository(MenuView)
        private readonly menuView: Repository<MenuView>,
        private readonly entityManager: EntityManager,
    ) {}

    async executeQueryBuilder<T>(qb: SelectQueryBuilder<T>, type: ExecuteQueryBuilderType) {
        switch (type) {
            case ExecuteQueryBuilderType.MANY:
                return qb.getRawMany();
            case ExecuteQueryBuilderType.ONE:
                return qb.getRawOne();
        }
    }
}
