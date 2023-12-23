import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    EntityManager,
    FindManyOptions,
    FindOptionsWhere,
    Repository,
    FindOptionsSelect,
    FindOptionsRelations,
} from 'typeorm';
import { Menu } from './entity/menu.entity';
import { MenuView } from './entity/menu-view.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class MenusRepository {
    protected readonly logger = new Logger(MenusRepository.name);

    constructor(
        @InjectRepository(Menu)
        private readonly menus: Repository<Menu>,
        @InjectRepository(MenuView)
        private readonly menuView: Repository<MenuView>,
        public entityManager: EntityManager,
    ) {}

    async findOneMenu(
        where: FindOptionsWhere<Menu>,
        select?: FindOptionsSelect<Menu>,
        relations?: FindOptionsRelations<Menu>,
    ) {
        return await this.menus.findOne({
            where,
            select,
            relations,
        });
    }

    async existMenu(where: FindManyOptions<Menu>) {
        return await this.menus.exist(where);
    }

    async updateStore(menu: Menu, partialEntity: QueryDeepPartialEntity<Menu>) {
        await this.menus.update(menu.id, partialEntity);

        return await this.menus.findOneBy({
            id: menu.id,
        });
    }
}
