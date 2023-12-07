import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MenusRepository } from './menus.repository';
import { EntityManager } from 'typeorm';
import { UsersRepository } from 'src/users/users.repository';
import { StoresRepository } from 'src/stores/stores.repository';
import { Store } from 'src/stores/entity/store.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { User } from 'src/users/entity/user.entity';
import { Roles } from 'src/users/enum/roles.enum';
import { MenuStatus } from './enum/menu-status.enum';
import { CreateMenuArgs } from './interface/create-menu.interface';
import { FindDetailOneMenu } from './interface/find-detail-one-menu.interface';
import { MenusException } from 'src/global/exception/menus-exception';
import { StoresException } from 'src/global/exception/stores-exception';
import { FindSimpleOneMenu } from './interface/find-simple-one-menu.interface';
import { UpdateMenuArgs } from './interface/update-menu.interface';
import { CAUTION_TEXT } from 'src/global/common/caution.constant';

@Injectable()
export class MenusService implements OnModuleInit {
    constructor(
        private readonly meunusRepository: MenusRepository,
        private readonly entityManager: EntityManager,
        private readonly usersRepository: UsersRepository,
        private readonly storesRepository: StoresRepository,
        private readonly configService: ConfigService,
    ) {}

    async onModuleInit() {
        await this.createMockMenuData();
    }

    async create(user: User, args: CreateMenuArgs) {
        const storeId: number = args.storeId;
        const storeData: Store = await this.storesRepository.findOne({ id: storeId });
        if (!storeData) {
            throw StoresException.ENTITY_NOT_FOUND;
        }

        await this.validateMenuName(storeData, args.name);
        await this.validateUserRole(user, Roles.OWNER);
        const inputData = {
            name: args.name,
        };
        const newMenu = new Menu({
            ...args,
            store: storeData,
        }); // TODO: 메뉴 request body 컬럼 논의중

        return (await this.meunusRepository.create(newMenu)).id;
    }

    async update(menuId: number, args: UpdateMenuArgs) {
        await this.validateMenuId(menuId);
        return this.meunusRepository.findOneAndUpdate({ id: menuId }, { ...args });
    }

    async delete(menuId: number) {
        return this.meunusRepository.findOneAndDelete({ id: menuId });
    }

    async findDetailOne(menuId: number, lat: number, lon: number): Promise<FindDetailOneMenu> {
        const data = await this.entityManager
            .createQueryBuilder(Menu, 'menus')
            .leftJoinAndSelect(Store, 'stores', 'stores.id = menus.store_id')
            .select(
                'menus.menu_picture_url AS mainMenuPictureUrl, menus.description, menus.name, menus.discount_rate AS discountRate, menus.price, menus.view_count AS viewCount',
            )
            .addSelect(
                'stores.id AS storeId, stores.cooking_time AS cookingTime, stores.name AS storeName, stores.address AS storeAddress, stores.phone, stores.latitude AS storeLatitude, stores.longitude AS storeLongitude, stores.country_of_origin AS countryOfOrigin',
            )
            .where(`menus.id = ${menuId}`)
            .getRawOne();
        if (!data) throw MenusException.ENTITY_NOT_FOUND;
        const anotherMenus = await this.getAllMenu(data.storeId, menuId);
        const caution = CAUTION_TEXT;
        delete data.storeId; // 필요없는 값이므로 삭제
        const menuDetailList = {
            ...data,
            anotherMenus: anotherMenus ? anotherMenus : null, // 다른 메뉴가 없을 경우 null로 전송
            caution,
        };
        return menuDetailList;
    }

    private async validateMenuId(menuId: number) {
        const isExist = await this.meunusRepository.exist({ id: menuId });
        if (!isExist) throw MenusException.ENTITY_NOT_FOUND;
    }

    private async validateMenuName(store: Store, menuName: string) {
        const isExist = await this.meunusRepository.exist({ name: menuName, store: store });
        if (isExist) throw MenusException.ALREADY_EXIST_MENU_NAME;
    }

    private async validateUserRole(user: User, role: Roles) {
        if (user?.role != role) throw MenusException.HAS_NO_PERMISSION_CREATE;
    }

    private async getAllMenu(storeId: number, excludeMenuId: number = 0): Promise<FindSimpleOneMenu[]> {
        // 제외할 메뉴 ID 필요없이 모든 메뉴를 가져올경우 excludeMenuId를 0으로 지정
        return await this.entityManager
            .createQueryBuilder(Menu, 'menus')
            .select(
                'menus.menu_picture_url AS menuPictureUrl, menus.id AS menuId, menus.name, menus.discount_rate AS discountRate, menus.price',
            )
            .where(`menus.id != ${excludeMenuId} AND store_id = ${storeId}`)
            .orderBy('discountRate', 'DESC')
            .getRawMany();
    }

    private async measureDistance(x1: number, x2: number, y1: number, y2: number): Promise<number> {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    private async createMockMenuData() {
        const names = ['돈까스', '돈까스세트', '돈까스세트메밀국수', '돈까스세트메밀국수우동'];

        const sale_rates = [10, 20, 30, 40];

        const prices = [10000, 15000, 16000, 17000];

        const imageUrl = ['menuImage1', 'menuImage2', 'menuImage3', 'menuImage4'];

        const descriptions = ['설명1', '설명2', '설명3', '설명4'];

        const storeId = [1, 2, 3, 1];

        let i = 0;

        const isExist = await this.usersRepository.exist({
            name: '이사장',
        });

        if (!isExist) {
            const newOwner = new User({
                fId: 'owner0002',
                name: '이사장',
                role: Roles.OWNER,
                phone: '010-5678-5678',
            });

            const user = await this.usersRepository.create(newOwner);

            for (const name of names) {
                const storeInfo = await this.storesRepository.findOne({ id: storeId[i] }, {}, { id: true });
                const mockMenu = new Menu({
                    name,
                    discountRate: sale_rates[i],
                    price: prices[i],
                    menuPictureUrl: imageUrl[i],
                    popularity: null,
                    status: MenuStatus.SALE,
                    expiredDate: null,
                    description: descriptions[i],
                    viewCount: 0,
                    store: storeInfo ? storeInfo : null,
                });
                i++;
                await this.meunusRepository.create(mockMenu);
            }
        }
    }
}
