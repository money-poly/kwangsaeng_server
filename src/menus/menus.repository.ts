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
import { CreateMenuArgs } from './interface/create-menu.interface';
import { Store } from 'src/stores/entity/store.entity';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { DynamoKey, DynamoSchema } from 'src/stores/interfaces/store-menu-dynamo.interface';

@Injectable()
export class MenusRepository {
    protected readonly logger = new Logger(MenusRepository.name);

    constructor(
        @InjectRepository(Menu)
        private readonly menus: Repository<Menu>,
        @InjectRepository(MenuView)
        private readonly menuView: Repository<MenuView>,
        public entityManager: EntityManager,
        @InjectModel('Store-Menu')
        private dynamoModel: Model<DynamoSchema, DynamoKey>,
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

    async findView(menu: Menu) {
        return await this.entityManager
            .createQueryBuilder(MenuView, 'menus_view')
            .select('menus_view.view_count AS viewCount')
            .where('menus_view.menu_id = :id', { id: menu.id })
            .getRawOne();
    }

    async incrementView(menu: Menu, storeName: string) {
        const dynamoMenuData = await this.dynamoModel.get({ menuId: menu.id, storeName });
        const incrementDynamoMenuData = { ...dynamoMenuData, viewCount: dynamoMenuData.viewCount + 1 };
        await this.dynamoModel.update(incrementDynamoMenuData);
        return await this.menuView.increment({ id: menu.id }, 'viewCount', 1);
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

    async delete(menu: Menu) {
        await this.menus.softDelete({ id: menu.id });
    }

    async create(store: Store, args: CreateMenuArgs) {
        const newMenu = this.menus.create({
            ...args,
            store,
        });
        const menu = await this.menus.save(newMenu);
        const newMenuView = this.menuView.create({
            viewCount: 0,
            menu: newMenu,
        });
        await this.menuView.save(newMenuView);
        return menu;
    }
}
