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
import { User } from 'src/users/entity/user.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { CreateMenuArgs } from './interface/create-menu.interface';

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

    async findOne(
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

    async exist(where: FindManyOptions<Menu>) {
        return await this.menus.exist(where);
    }

    async update(menu: Menu, partialEntity: QueryDeepPartialEntity<Menu>) {
        await this.menus.update(menu.id, partialEntity);

        return await this.menus.findOneBy({
            id: menu.id,
        });
    }

    async create(user: User, args: CreateMenuArgs) {
        const newMenu = this.menus.create({
            ...args,
            view: this.menuView.create({
                viewCount: 0,
            }),
        });
        await this.menus.save(newMenu);

        return newMenu.id;
    }
}
