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
import { MenuStatus } from './enum/menu-status.enum';
import { OwnStore } from './interface/own-store.interface';
import { Seller } from 'src/users/entity/seller.entity';
import { LocationInfo } from './interface/location-info.interface';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';

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

    async findView(menu: Menu) {
        return await this.entityManager
            .createQueryBuilder(MenuView, 'menus_view')
            .select('menus_view.view_count', 'viewCount')
            .where('menus_view.menu_id = :id', { id: menu.id })
            .getRawOne();
    }

    async incrementView(menu: Menu, storeName: string): Promise<void> {
        await this.menuView.increment({ id: menu.id }, 'viewCount', 1);
        return;
    }

    async exist(where: FindManyOptions<Menu>) {
        return await this.menus.exist(where);
    }

    async update(menu: Menu, partialEntity: QueryDeepPartialEntity<Menu>) {
        if (partialEntity.description === '') {
            partialEntity.description = null;
        } // 빈 문자열로 넘어올경우 null로 지정
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

    async findMenusForOrder(store: Store, orderBy: string) {
        return await this.entityManager
            .createQueryBuilder(Menu, 'm')
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
            .orderBy(orderBy, 'DESC')
            .getRawMany();
    }

    async findOwnStoreForMenuId(menuId: number) {
        const data = (await this.entityManager
            .createQueryBuilder(Menu, 'm')
            .leftJoinAndSelect(Store, 's', 'm.store_id = s.id')
            .leftJoinAndSelect(Seller, 'u', 's.user_id = u.id')
            .select('m.id', 'menuId')
            .addSelect('s.id', 'storeId')
            .addSelect('u.id', 'userId')
            .where('m.id = :menuId', { menuId })
            .getRawOne()) as OwnStore;
        return data;
    }

    async recommendation(args: LocationInfo) {
        return await this.entityManager
            .createQueryBuilder(Menu, 'm')
            .leftJoinAndSelect(Store, 's', 'm.store_id = s.id')
            .leftJoinAndSelect(StoreDetail, 'sd', 's.id = sd.store_id')
            .leftJoinAndSelect(MenuView, 'mv', 'm.id = mv.menu_id')
            .select('m.id', 'menuId')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('m.name', 'menuName')
            .addSelect('m.price', 'price')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.selling_price', 'sellingPrice')
            .addSelect('m.expired_date', 'expiredDate')
            .addSelect('s.id', 'storeId')
            .addSelect('s.name', 'storeName')
            .orderBy('m.selling_price', 'ASC') // 가격 낮은 순
            .addOrderBy('m.discount_rate', 'DESC') // 할인율 높은 순
            .addOrderBy('mv.view_count', 'DESC') // 인기 많은 순(조회수가 높은 순)
            .addOrderBy('m.expired_date', 'DESC') // 소비기한 긴 순
            .where(
                'ST_DWithin(ST_SetSRID(ST_MakePoint(sd.lon, sd.lat), 4326), ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), :range)',
                { longitude: args.lon, latitude: args.lat, range: 3000 },
            )
            .limit(5) // 5개 제한
            .getRawMany();
    }
}
