import { Injectable, Logger } from '@nestjs/common';
import { MenusRepository } from './menus.repository';
import { EntityManager, FindManyOptions, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
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
import { FindOneMenuDetailDto } from './dto/find-one-menu.dto';
import { UpdateMenuOrderDto } from './dto/update-order.dto';
import { Category } from 'src/categories/entity/category.entity';
import { FindAsLocationDto } from './dto/find-as-loaction.dto';
import { MenuFilterType } from './enum/discounted-menu-filter-type.enum';
import { StoreStatus } from 'src/stores/enum/store-status.enum';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { UpdateStatusArgs } from './interface/update-status.interface';
import { StoreApproveStatus } from 'src/stores/enum/store-approve-status.enum';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { DynamoKey, DynamoSchema } from 'src/stores/interfaces/store-menu-dynamo.interface';
import { DynamoException } from 'src/global/exception/dynamo-exception';
import {
    mockCountryOfOrigins,
    mockDiscountRates,
    mockMenuDescriptions,
    mockMenuNames,
    mockMenuPictureUrl,
    mockMenuStatus,
    mockPrices,
    mockSalePrices,
} from 'src/global/common/mock.constant';

@Injectable()
export class MenusService {
    constructor(
        private readonly menusRepository: MenusRepository,
        private readonly entityManager: EntityManager,
        private readonly usersRepository: UsersRepository,
        private readonly storesRepository: StoresRepository,
        private readonly logger: Logger,
        @InjectModel('Store-Menu')
        private dynamoModel: Model<DynamoSchema, DynamoKey>,
    ) {}

    async create(user: User, args: CreateMenuArgs) {
        const storeId: number = args.storeId;
        const storeData: Store = await this.storesRepository.findOneStore({ id: storeId }, {}, { user: true });
        if (!storeData) {
            throw StoresException.ENTITY_NOT_FOUND;
        }
        if (user.id !== (await storeData.user).id) {
            throw MenusException.HAS_NO_PERMISSION_CREATE;
        }
        await this.validateUserRole(user, Roles.OWNER);
        const createdMenu = await this.menusRepository.create(storeData, args);
        await this.storesRepository.addOrder(storeData, createdMenu);
        const dynamoInsertData = {
            menuId: createdMenu.id,
            storeName: storeData.name,
            storeId: storeData.id,
            menuName: createdMenu.name,
            menuPictureUrl: createdMenu.menuPictureUrl,
            sellingPrice: createdMenu.salePrice,
            discountRate: createdMenu.discountRate,
            viewCount: 0,
        };
        try {
            await this.dynamoModel.create(dynamoInsertData);
        } catch (error) {
            switch (error.code) {
                case 'ConditionalCheckFailedException':
                    throw DynamoException.CONDITION_CHECK_FAILED;
                case 'ProvisionedThroughputExceededException':
                    throw DynamoException.PROVISIONED_THROUGHPUT_EXCEEDED;
                case 'ItemCollectionSizeLimitExceededException':
                    throw DynamoException.ITEM_COLLECTION_SIZE_LIMIT_EXCEEDED;
                case 'ResourceNotFoundException':
                    throw DynamoException.RESOURCE_NOT_FOUND;
                case 'LimitExceededException':
                    throw DynamoException.Limit_Exceeded;
                case 'RequestLimitExceeded':
                    throw DynamoException.Request_Limit_Exceeded;
                case 'ValidationException':
                    throw DynamoException.VALIDATION_ERROR;
                case 'TransactionConflictException':
                    throw DynamoException.TRANSACTION_CONFLICT;
                case 'InternalServerError':
                    throw DynamoException.INTERNAL_SERVER_ERROR;
            }
        }
        return { menuId: createdMenu.id };
    }

    async update(menu: Menu, args: UpdateMenuArgs) {
        const dynamoMenuData = await this.dynamoModel.get({ menuId: menu.id, storeName: menu.store.name });
        if (dynamoMenuData) {
            await this.dynamoModel.update({
                ...dynamoMenuData,
                ...args,
                menuName: args.name ? args.name : menu.store.name,
            });
        } else {
            this.logger.error(DynamoException.ITEM_NOT_FOUND);
        } // dynamo쪽에 해당 데이터가 없을경우 로깅
        await this.menusRepository.update(menu, { ...args });
        return this.findDetailOne(menu.id);
    }

    async delete(user: User, menu: Menu) {
        // 메뉴 삭제시 순서에서도 삭제
        const menuData = await this.entityManager
            .createQueryBuilder(Menu, 'm')
            .leftJoinAndSelect(Store, 's', 's.id = m.store_id')
            .leftJoinAndSelect(StoreDetail, 'sd', 'sd.store_id = m.store_id')
            .select('m.id AS menuId')
            .addSelect('s.name AS storeName, s.user_id AS userId')
            .addSelect('sd.menu_orders AS orders')
            .where('m.id = :menuId', { menuId: menu.id })
            .getRawOne();
        if (menuData.userId !== user.id) {
            throw MenusException.HAS_NO_PERMISSION_DELETE;
        }
        const order = menuData.orders.split(',');
        const findIdx = order.findIndex((id) => Number(id) === menu.id);
        order.splice(findIdx, 1);
        await this.updateOrder(menu.store, { order });
        await this.dynamoModel.delete({ menuId: menuData.menuId, storeName: menuData.storeName });
        return this.menusRepository.delete(menu);
    }

    async findDetailOne(menuId: number, loc?: FindOneMenuDetailDto): Promise<FindDetailOneMenu> {
        const menu = await this.menusRepository.findOne(
            { id: menuId },
            {
                id: true,
                menuPictureUrl: true,
                description: true,
                name: true,
                discountRate: true,
                price: true,
                salePrice: true,
                count: true,
                expiredDate: true,
                countryOfOrigin: true,
                view: {
                    viewCount: true,
                },
                store: {
                    id: true,
                },
            },
            { view: true, store: true },
        );

        const store: any = await this.storesRepository.findOneStore(
            { id: menu.store.id },
            {
                id: true,
                name: true,
                detail: { address: true, addressDetail: true, lat: true, lon: true, cookingTime: true, phone: true },
            },
            { detail: true },
        );

        const anotherMenus = await this.getMenusInStore(store.id, menu.id, 3);

        let refinedPickUpTime;
        if (loc) {
            const { lat, lon } = loc;
            refinedPickUpTime = await this.storesRepository.measurePickUpTime(
                store.detail.cookingTime,
                lat,
                store.detail.lat,
                lon,
                store.detail.lon,
            );
        }
        store.detail.pickUpTime = refinedPickUpTime;

        const menuDetailList = {
            ...menu,
            sellingPrice: menu.salePrice,
            store,
            anotherMenus: anotherMenus ? anotherMenus : null, // 다른 메뉴가 없을 경우 null로 전송
            viewCount: menu.view.viewCount,
            caution: CAUTION_TEXT,
        };
        await this.menusRepository.incrementView(menu, store.name);
        delete menuDetailList.salePrice;
        delete menuDetailList.view;
        delete menuDetailList.store.detail.cookingTime; // 쓸모없는 값 제거
        return menuDetailList;
    }

    async findManyForSeller(store: Store, status?: MenuStatus) {
        let where = `m.store_id = "${store.id}"`;
        switch (status) {
            case undefined: // status가 비어있는경우 -> 메뉴 전체 조회
                break;
            case MenuStatus.SALE:
                where += ` AND m.status = "${MenuStatus.SALE}"`;
                break;
            case MenuStatus.SOLDOUT:
                where += ` AND m.status = "${MenuStatus.SOLDOUT}"`;
                break;
            case MenuStatus.HIDDEN:
                where += ` AND m.status = "${MenuStatus.HIDDEN}"`;
                break;
            default:
                throw MenusException.STATUS_NOT_FOUND;
        }

        const orderBy = await this.storesRepository.processOrderBy(store);

        const data = await this.entityManager
            .createQueryBuilder(Menu, 'm')
            .select(
                'm.id, m.name, m.discount_rate AS discountRate, m.sale_price AS sellingPrice, m.price, m.menu_picture_url AS menuPictureUrl, m.status',
            )
            .where(where)
            .orderBy(`m.status = "${MenuStatus.SALE}"`, 'DESC')
            .addOrderBy(`m.status = "${MenuStatus.SOLDOUT}"`, 'DESC')
            .addOrderBy(`m.status = "${MenuStatus.HIDDEN}"`, 'DESC')
            .addOrderBy(orderBy, 'DESC')
            .getRawMany();
        return data;
    }

    async updateOrder(store: Store, dto: UpdateMenuOrderDto) {
        const newOrder = dto.order;
        return await this.storesRepository.updateOrder(store, newOrder);
    }

    async updateStatus(menu: Menu, dto: UpdateStatusArgs) {
        // 숨김 -> 품절 혹은 반대시 == order변동 x
        const { prevStatus, updateStatus } = dto;
        if (
            prevStatus === updateStatus ||
            (prevStatus === MenuStatus.HIDDEN && updateStatus === MenuStatus.SOLDOUT) ||
            (prevStatus === MenuStatus.SOLDOUT && updateStatus === MenuStatus.HIDDEN)
        ) {
            return await this.menusRepository.update(menu, { status: dto.updateStatus });
        }
        // 숨김, 품절 -> 판매중 == order의 맨 앞에 붙이기
        const order = await this.storesRepository.findOrder(menu.store);
        if (updateStatus === MenuStatus.SALE) {
            order.unshift(menu.id);
        }
        // 판매중 -> 숨김, 품절으로 전환시 = order에서 삭제
        if (updateStatus === MenuStatus.HIDDEN || updateStatus === MenuStatus.SOLDOUT) {
            const idx = order.findIndex((id) => Number(id) === menu.id);
            order.splice(idx, 1);
        }
        await this.updateOrder(menu.store, { order });
        this.menusRepository.update(menu, { status: dto.updateStatus });
        return await this.findDetailOne(menu.id);
    }

    async findMaxDiscount(dto: FindAsLocationDto) {
        let refindedData = [];
        const subQuery = await this.entityManager
            .createQueryBuilder(Store, 's')
            .leftJoinAndSelect(Menu, 'm', 's.id = m.store_id')
            .select('s.id')
            .addSelect('MAX(discount_rate) AS discount_rate')
            .where(`s.status = "${StoreStatus.OPEN}"`)
            .andWhere(`m.status = "${MenuStatus.SALE}"`)
            .groupBy('s.id')
            .getQuery();

        const dataList = await this.entityManager
            .createQueryBuilder(Store, 's')
            .leftJoinAndSelect(Menu, 'm', 's.id = m.store_id')
            .leftJoinAndSelect(StoreDetail, 'sd', 's.id = sd.store_id')
            .leftJoinAndSelect(StoreApprove, 'sa', 's.id = sa.store_id')
            .leftJoin('store_categories', 'sc', 's.id = sc.stores_id')
            .leftJoinAndSelect(Category, 'c', 'sc.categories_id = c.id')
            .select('c.name', 'category')
            .addSelect('s.name', 'storeName')
            .addSelect('m.id', 'menuId')
            .addSelect('m.name', 'menuName')
            .addSelect('m.price', 'price')
            .addSelect('m.sale_price', 'sellingPrice')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .where('(s.id, m.discount_rate) IN (' + subQuery + ')')
            .andWhere('ST_Distance_Sphere(POINT(:lon, :lat), POINT(sd.lon, sd.lat)) <= :range', {
                lon: dto.lon,
                lat: dto.lat,
                range: 3000,
            })
            .andWhere('sa.is_approved = :isApproved', { isApproved: StoreApproveStatus.DONE })
            .orderBy('c.name')
            .addOrderBy('m.discount_rate', 'DESC')
            .addOrderBy('m.created_date')
            .getRawMany();
        if (!dataList.length) {
            // 검색되는 메뉴가 존재하지 않을경우 빈배열 리턴
            return dataList;
        }
        let prevCategory;
        for (const data of dataList) {
            if (prevCategory != data.category) {
                prevCategory = data.category;
                refindedData.push(this.processDetailMenu(data));
                // category, discount_rate, create_date순으로 정렬되어 있기 때문에,
                // 반복문이 돌아가면서 카테고리가 변경됐을 경우 첫 번째 data가 그 카테고리 내에서 가장 할인율이 높고 등록된지 오래된 메뉴
            }
        }
        return refindedData;
    }

    async findManyDiscount(type: MenuFilterType, dto: FindAsLocationDto) {
        let orderBy;
        switch (type) {
            case MenuFilterType.DISTANCE:
                orderBy = `ST_Distance_Sphere(POINT(${dto.lon}, ${dto.lat}), POINT(sd.lon, sd.lat))`;
                break;
            case MenuFilterType.LAST:
                orderBy = 'm.created_date';
                break;
            case MenuFilterType.NAME:
                orderBy = 'm.name';
                break;
            default:
                throw MenusException.FILTER_TYPE_NOT_FOUND;
        }

        const dataList = await this.entityManager
            .createQueryBuilder(Menu, 'm')
            .leftJoinAndSelect(Store, 's', 'm.store_id = s.id')
            .leftJoinAndSelect(StoreDetail, 'sd', 's.id = sd.store_id')
            .leftJoinAndSelect(StoreApprove, 'sa', 's.id = sa.store_id')
            .leftJoinAndSelect('store_categories', 'sc', 'm.store_id = sc.stores_id')
            .leftJoinAndSelect(Category, 'c', 'sc.categories_id = c.id')
            .leftJoinAndSelect('menu_views', 'mv', 'm.id = mv.menu_id')
            .select('c.name', 'category')
            .addSelect('s.name', 'storeName')
            .addSelect('m.id', 'menuId')
            .addSelect('m.name', 'menuName')
            .addSelect('m.price', 'price')
            .addSelect('m.sale_price', 'sellingPrice')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('mv.view_count', 'viewCount')
            .where(`s.status = "${StoreStatus.OPEN}"`)
            .andWhere(`m.status = "${MenuStatus.SALE}"`)
            .andWhere('m.discount_rate > 0')
            .andWhere('sa.is_approved = :isApproved', { isApproved: StoreApproveStatus.DONE })
            .andWhere('ST_Distance_Sphere(POINT(:lon, :lat), POINT(sd.lon, sd.lat)) <= :range', {
                lon: dto.lon,
                lat: dto.lat,
                range: 3000,
            })
            .orderBy(orderBy, 'ASC')
            .getRawMany();
        if (!dataList.length) {
            // 검색되는 메뉴가 존재하지 않을경우 빈배열 리턴
            return dataList;
        }

        const refindedData = [{ category: '전체', menus: dataList.slice() }]; // dataList의 깊은 복사를 위해 slice함수 사용
        dataList.sort((menu1, menu2) => {
            if (menu1.category < menu2.category) {
                return -1;
            } else if (menu1.category > menu2.category) {
                return 1;
            } else {
                return 0; // 카테고리가 같을 경우
            }
        }); // 카테고리 이름별로 재정렬

        let prevCategory = dataList[0].category;
        let prevArray = [];
        for (const data of dataList) {
            const menu = {
                menuId: data.menuId,
                menuName: data.menuName,
                discountRate: data.discountRate,
                sellingPrice: data.sellingPrice,
                storeName: data.storeName,
                menuPictureUrl: data.menuPictureUrl,
                viewCount: data.viewCount,
            };
            if (prevCategory !== data.category) {
                refindedData.push({ category: prevCategory, menus: prevArray });
                prevCategory = data.category;
                prevArray = [menu];
            } else {
                prevArray.push(menu);
            }
        }
        refindedData.push({ category: prevCategory, menus: prevArray });
        // 위에서 카테고리가 변경될때만 push해줬으므로 마지막 카테고리는 반영안됨. 그러므로 마지막에 별도로 push
        return refindedData;
    }

    async findOne(
        where: FindOptionsWhere<Menu>,
        select?: FindOptionsSelect<Menu>,
        relations?: FindOptionsRelations<Menu>,
    ) {
        return await this.menusRepository.findOne(where, select, relations);
    }

    async exist(where: FindManyOptions<Menu>) {
        return await this.menusRepository.exist(where);
    }

    async findMenusForOrder(store: Store, orderBy: string) {
        return await this.menusRepository.findMenusForOrder(store, orderBy);
    }

    private processDetailMenu(data) {
        const menu = {
            id: data.menuId,
            menuPictureUrl: data.menuPictureUrl,
            name: data.menuName,
            price: data.price,
            discountRate: data.discountRate,
            sellingPrice: data.sellingPrice,
        };
        const store = { name: data.storeName, menu };
        const pushData = { category: data.category, store };
        return pushData;
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
                'menus.menu_picture_url AS menuPictureUrl, menus.id AS menuId, menus.name, menus.discount_rate AS discountRate, menus.price, menus.description',
            )
            .where('menus.id != :excludeMenuId AND store_id = :storeId', { excludeMenuId, storeId })
            .orderBy('discountRate', 'DESC')
            .addOrderBy('price', 'DESC')
            .limit(limit)
            .getRawMany();
    }

    async initMockMenus() {
        const storeId = [1, 2, 3, 4, 5];
        const isExist = await this.menusRepository.exist({ where: { name: '브룩클린 바게트' } });
        if (!isExist) {
            for (let i = 0; i < 5; i++) {
                const storeInfo = await this.storesRepository.findOneStore({ id: storeId[i] }, { id: true }, {});
                for (let j = 0; j < 7; j++) {
                    const mockMenu: CreateMenuArgs = {
                        name: mockMenuNames[i][j],
                        discountRate: mockDiscountRates[i][j],
                        price: mockPrices[i][j],
                        salePrice: mockSalePrices[i][j],
                        status: mockMenuStatus[i][j],
                        description: mockMenuDescriptions[i][j],
                        storeId: storeInfo.id,
                        countryOfOrigin: mockCountryOfOrigins[i],
                        menuPictureUrl: mockMenuPictureUrl[i][j],
                    };
                    const createdMenu = await this.menusRepository.create(storeInfo, { ...mockMenu });
                    await this.storesRepository.addOrder(storeInfo, createdMenu);
                }
            }
        }
    }
}
