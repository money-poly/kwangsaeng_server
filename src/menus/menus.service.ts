import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MenusRepository } from './menus.repository';
import { EntityManager, FindManyOptions, FindOptionsWhere } from 'typeorm';
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
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { FindOneMenuDto } from './dto/find-one-menu.dto';

@Injectable()
export class MenusService {
    constructor(
        private readonly menusRepository: MenusRepository,
        private readonly entityManager: EntityManager,
        private readonly usersRepository: UsersRepository,
        private readonly storesRepository: StoresRepository,
        private readonly configService: ConfigService,
    ) {}

    async create(user: User, args: CreateMenuArgs) {
        const storeId: number = args.storeId;
        const storeData: Store = await this.storesRepository.findOneStore({ id: storeId });
        if (!storeData) {
            throw StoresException.ENTITY_NOT_FOUND;
        }
        await this.validateUserRole(user, Roles.OWNER);
        const createdId = await this.menusRepository.create(storeData, args);
        return { menuId: createdId };
    }

    async update(menu: Menu, args: UpdateMenuArgs) {
        await this.menusRepository.update(menu, { ...args });
        return await this.findDetailOne(menu);
    }

    async delete(menu: Menu) {
        return this.menusRepository.delete(menu);
    }

    async findDetailOne(menu: Menu, loc?: FindOneMenuDto): Promise<FindDetailOneMenu> {
        const data = await this.entityManager
            .createQueryBuilder(Menu, 'menus')
            .leftJoinAndSelect(Store, 'stores', 'stores.id = menus.store_id')
            .leftJoinAndSelect(StoreDetail, 'store_detail', 'store_detail.store_id = menus.store_id')
            .select(
                'menus.menu_picture_url AS mainMenuPictureUrl, menus.description, menus.name AS name, menus.discount_rate AS discountRate, menus.price, menus.sale_price AS sellingPrice, menus.country_of_origin AS countryOfOrigin',
            )
            .addSelect('stores.id AS storeId, stores.name AS storeName')
            .addSelect(
                'store_detail.address AS storeAddress, store_detail.phone, store_detail.lat AS lat, store_detail.lon AS lon, store_detail.cooking_time AS cookingTime',
            )
            .where('menus.id = :id', { id: menu.id })
            .getRawOne();
        const view = await this.menusRepository.findView(menu);
        const anotherMenus = await this.getMenusInStore(data.storeId, menu.id, 3);
        let pickUpTimeStr = null;
        if (loc) {
            const { lat, lon } = loc;
            const pickUpTime = (await this.measurePickUpTime(lat, data.lat, lon, data.lon)) + data.cookingTime;
            pickUpTimeStr = pickUpTime.toString() + '~' + (pickUpTime + 8).toString();
        }
        delete data.cookingTime;
        const caution = CAUTION_TEXT;
        const menuDetailList = {
            ...data,
            anotherMenus: anotherMenus ? anotherMenus : null, // 다른 메뉴가 없을 경우 null로 전송
            ...view,
            cookingTime: pickUpTimeStr ? pickUpTimeStr : null, // 사용자의 거리값을 안 보냈을 경우(update 시) null로 전송
            caution,
        };
        return menuDetailList;
    }

    async findManyForSeller(storeId: number) {
        const data = await this.entityManager
            .createQueryBuilder(Menu, 'menus')
            .select(
                'menus.id, menus.name, menus.discount_rate AS discountRate, menus.sale_price AS sellingPrice, menus.price, menus.menu_picture_url AS menuPictureUrl, menus.status',
            )
            .addOrderBy(`menus.status = "${MenuStatus.SALE}"`, 'DESC')
            .addOrderBy(`menus.status = "${MenuStatus.SOLDOUT}"`, 'DESC')
            .addOrderBy(`menus.status = "${MenuStatus.HIDDEN}"`, 'DESC')
            .where('menus.store_id = :storeId', { storeId })
            .getRawMany();
        return data;
    }

    async findOne(where: FindOptionsWhere<Menu>) {
        return await this.menusRepository.findOne(where);
    }

    async exist(where: FindManyOptions<Menu>) {
        return await this.menusRepository.exist(where);
    }

    private async validateUserRole(user: User, role: Roles) {
        if (user?.role != role) throw MenusException.HAS_NO_PERMISSION_CREATE;
    }

    private async getMenusInStore(
        storeId: number,
        excludeMenuId: number = 0,
        limit: number = 10,
    ): Promise<FindSimpleOneMenu[]> {
        // 제외할 메뉴 ID 필요없이 모든 메뉴를 가져올경우 excludeMenuId를 0으로 지정
        // limit으로 필요한 데이터의 개수 보내주기(기본값 10으로 설정)
        return await this.entityManager
            .createQueryBuilder(Menu, 'menus')
            .select(
                'menus.menu_picture_url AS menuPictureUrl, menus.id AS menuId, menus.name, menus.discount_rate AS discountRate, menus.price',
            )
            .where('menus.id != :excludeMenuId AND store_id = :storeId', { excludeMenuId, storeId })
            .orderBy('discountRate', 'DESC')
            .addOrderBy('price', 'DESC')
            .limit(limit)
            .getRawMany();
    }

    private async measurePickUpTime(x1: number, x2: number, y1: number, y2: number): Promise<number> {
        const distance: number = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        let time: number;
        if (distance < 200) {
            time = 5;
        } else if (distance < 500) {
            time = 15;
        } else if (distance < 1000) {
            time = 23;
        } else {
            time = -1; // TODO 시간대별로 변경사항 존재
        }
        return time;
    }

    async initMockMenus() {
        const names = [
            '돈까스',
            '돈까스세트',
            '돈까스세트메밀국수',
            '돈까스세트메밀국수우동',
            '로제돈까스',
            '로제돈까스 우동',
            '초밥',
            '오렌지 치즈 샐러드(M)',
        ];
        const discountRates = [10, 20, 30, 40, 10, 20, 30, 40];
        const prices = [10000, 15000, 16000, 17000, 12000, 14000, 17000, 15000];
        const salePrices = [9000, 12000, 11200, 10200, 10233, 22000, 15000, 13000];
        const descriptions = ['설명1', '설명2', '설명3', '설명4', '설명5', '설명6', '설명7', '설명8'];
        const storeId = [1, 2, 3, 1, 1, 2, 1, 1];
        const countryOfOrigins = [
            {
                ingredient: '닭가슴살',
                origin: '국내산',
            },
            {
                ingredient: '김치',
                origin: '호주산',
            },
        ];
        let i = 0;
        const isExist = await this.usersRepository.exist({
            name: '이사장',
        });
        if (!isExist) {
            const newOwner = new User({
                fId: 'owner0006',
                name: '이사장',
                role: Roles.OWNER,
                phone: '010-5678-5678',
            });
            const user = await this.usersRepository.create(newOwner);
            for (const name of names) {
                const storeInfo = await this.storesRepository.findOneStore({ id: storeId[i] }, { id: true }, {});
                const mockMenu: CreateMenuArgs = {
                    name,
                    discountRate: discountRates[i],
                    price: prices[i],
                    salePrice: salePrices[i],
                    status: MenuStatus.SALE,
                    description: descriptions[i],
                    storeId: storeInfo.id,
                    countryOfOrigin: countryOfOrigins,
                };
                i++;
                await this.menusRepository.create(storeInfo, { ...mockMenu });
            }
        }
    }
}
