import { EntityManager, FindManyOptions, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { UsersRepository } from './../users/users.repository';
import { Injectable } from '@nestjs/common';
import { StoresRepository } from './stores.repository';
import { Store } from './entity/store.entity';
import { Roles } from 'src/users/enum/roles.enum';
import { User } from 'src/users/entity/user.entity';
import { StoresException } from 'src/global/exception/stores-exception';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { DynamoKey, DynamoSchema } from './interfaces/store-menu-dynamo.interface';
import { Menu } from 'src/menus/entity/menu.entity';
import { DynamoException } from 'src/global/exception/dynamo-exception';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreDetail } from './entity/store-detail.entity';
import { FindStoreWithLocationDto } from './dto/find-store-with-location.dto';
import { StoreApprove } from './entity/store-approve.entity';
import { StoreStatus } from './enum/store-status.enum';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Category } from 'src/categories/entity/category.entity';
import { FindStoreDetailDto } from './dto/find-store-detail.dto';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { StoreApproveStatus } from './enum/store-approve-status.enum';

@Injectable()
export class StoresService {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly entityManager: EntityManager,
        private readonly usersRepository: UsersRepository,
        @InjectModel('Store-Menu')
        private dynamoModel: Model<DynamoSchema, DynamoKey>,
    ) {}

    async existStore(where: FindManyOptions<Store>) {
        return await this.storesRepository.existStore(where);
    }

    async createStore(user: User, dto: CreateStoreDto) {
        return await this.storesRepository.createStore(user, dto);
    }

    async toggleStoreStatus(store: Store) {
        if (store.status == StoreStatus.OPEN) {
            await this.storesRepository.updateStore(store, { status: StoreStatus.CLOSED });
        } else {
            await this.storesRepository.updateStore(store, { status: StoreStatus.OPEN });
        }

        return await this.storesRepository.findOneStore(
            { id: store.id },
            {
                status: true,
            },
        );
    }

    async updateStore(store: Store, dto: UpdateStoreDto) {
        Object.assign(store, {
            name: dto.name ?? store.name,
            detail: {
                ...store.detail,
                address: dto.address ?? store.detail.address,
                addressDetail: dto.addressDetail ?? store.detail.addressDetail,
                description: dto.description ?? store.detail.description,
                operationTimes: dto.operationTimes ?? store.detail.operationTimes,
                cookingTime: dto.cookingTime ?? store.detail.cookingTime,
                storePictureUrl: dto.storePictureUrl ?? store.detail.storePictureUrl,
            },
        });

        return await this.storesRepository.saveStore(store);
    }

    async findOneStore(
        where: FindOptionsWhere<Store>,
        select?: FindOptionsSelect<Store>,
        relations?: FindOptionsRelations<Store>,
    ) {
        return await this.storesRepository.findOneStore(where, select, relations);
    }

    async approve(store: Store) {
        const approve = await this.storesRepository.findOneApprove({
            store: {
                id: store.id,
            },
        });

        if (approve.isApproved === StoreApproveStatus.DONE) {
            throw StoresException.ALREADY_APPROVED;
        }

        return await this.storesRepository.approve(approve);
    }

    async checkApprove(storeId: number) {
        const storeApproveData = await this.storesRepository.findOneApprove({
            store: {
                id: storeId,
            },
        });
        return { status: storeApproveData.isApproved };
    }

    async onMapFindStore(storeId: number) {
        const qb = await this.entityManager
            .createQueryBuilder(Store, 's')
            .leftJoinAndSelect(StoreDetail, 'sd', 'sd.store_id = s.id')
            .leftJoinAndSelect(Menu, 'm', 'm.store_id = s.id')
            .select('s.name AS name')
            .addSelect('sd.store_picture_url AS storePictureUrl')
            .addSelect('sd.description AS description')
            .addSelect('IFNULL(MAX(m.discount_rate), 0) maxDiscount')
            .where('s.id = :storeId', { storeId })
            .getRawOne();

        return qb;
    }

    async findStore(storeId: number, dto: FindStoreDetailDto) {
        const orderBy = await this.storesRepository.processOrderBy(await this.findOneStore({ id: storeId }));
        const dataList = await this.entityManager
            .createQueryBuilder(Menu, 'm')
            .leftJoinAndSelect(Store, 's', 's.id = m.store_id')
            .leftJoinAndSelect(StoreApprove, 'sa', 's.id = sa.store_id')
            .leftJoinAndSelect(StoreDetail, 'sd', 's.id = sd.store_id')
            .leftJoin('store_categories', 'sc', 's.id = sc.stores_id')
            .leftJoinAndSelect(Category, 'c', 'sc.categories_id = c.id')
            .leftJoinAndSelect(User, 'u', 'u.id = s.user_id')
            .select('s.id', 'storeId')
            .addSelect('s.name', 'storeName')
            .addSelect('s.status', 'storeStatus')
            .addSelect('c.name', 'category')
            .addSelect('sd.address', 'address')
            .addSelect('sd.address_detail', 'addressDetail')
            .addSelect('sd.lat', 'lat')
            .addSelect('sd.lon', 'lon')
            .addSelect('u.phone', 'phone')
            .addSelect('sd.cooking_time', 'cookingTime')
            .addSelect('sd.operation_times', 'operationTimes')
            .addSelect('sd.menu_orders', 'menuOrders')
            .addSelect('m.id', 'menuId')
            .addSelect('m.name', 'menuName')
            .addSelect('m.discount_rate', 'discountRate')
            .addSelect('m.sale_price', 'salePrice')
            .addSelect('m.price', 'price')
            .addSelect('m.menu_picture_url', 'menuPictureUrl')
            .addSelect('m.country_of_origin', 'countryOfOrigin')
            .addSelect('m.description', 'description')
            .addSelect(
                `CASE WHEN ST_Distance_Sphere(POINT(sd.lon, sd.lat), POINT(:lon, :lat)) <= 200 THEN 7
        WHEN ST_Distance_Sphere(POINT(sd.lon, sd.lat), POINT(:lon, :lat)) <= 500 THEN 10
        WHEN ST_Distance_Sphere(POINT(sd.lon, sd.lat), POINT(:lon, :lat)) <= 1000 THEN 15 ELSE 20
        END AS pickupTime`,
            )
            .where('s.id = :storeId', { storeId: storeId })
            .andWhere('sa.is_approved = :isApproved', { isApproved: StoreApproveStatus.DONE })
            .setParameters({ lat: dto.lat, lon: dto.lon })
            .orderBy(orderBy, 'DESC')
            .getRawMany();
        if (!dataList.length) {
            throw StoresException.NOT_APPROVED;
        }

        const menuList = [];
        for (const menu of dataList) {
            const refinedMenuData = {
                id: menu.menuId,
                name: menu.menuName,
                discountRate: menu.discountRate,
                salePrice: menu.salePrice,
                price: menu.price,
                menuPictureUrl: menu.menuPictureUrl,
                countryOfOrigin: menu.countryOfOrigin,
                description: menu.description,
            };
            menuList.push(refinedMenuData);
        }
        const store = {
            id: dataList[0].storeId,
            name: dataList[0].storeName,
            categories: [{ name: dataList[0].category }],
            detail: {
                address: dataList[0].address,
                addressDetail: dataList[0].addressDetail,
                lat: dataList[0].lat,
                lon: dataList[0].lon,
                phone: dataList[0].phone,
                cookingTime: dataList[0].cookingTime,
                operationTimes: dataList[0].operationTimes,
                pickupTime: dataList[0].pickupTime,
                menuOrders: dataList[0].menuOrders,
            },
            menus: menuList,
        };
        if (!store) {
            throw StoresException.ENTITY_NOT_FOUND;
        }

        return store;
    }

    async findStoresWithLocation(dto: FindStoreWithLocationDto) {
        return await this.entityManager
            .createQueryBuilder(Store, 'stores')
            .leftJoinAndSelect(StoreDetail, 'd', 'stores.id = d.store_id')
            .leftJoinAndSelect(StoreApprove, 'a', 'stores.id = a.store_id')
            .select('stores.id AS id')
            .addSelect('name')
            .addSelect('CAST(d.lat AS FLOAT) AS lat')
            .addSelect('CAST(d.lon AS FLOAT) AS lon')
            .where('ST_Distance_Sphere(POINT(:lon, :lat), POINT(lon, lat)) <= :range', {
                lon: dto.lon,
                lat: dto.lat,
                range: dto.range,
            })
            .andWhere('stores.status = :openStatus', { openStatus: StoreStatus.OPEN })
            .andWhere('a.isApproved = :approveStatus', { approveStatus: StoreApproveStatus.DONE })
            .getRawMany();
    }

    async migrateDynamo() {
        const dataList = await this.entityManager
            .createQueryBuilder(Menu, 'menus')
            .leftJoinAndSelect(Store, 'stores', 'stores.id = menus.store_id')
            .leftJoinAndSelect(MenuView, 'menu_views', 'menus.id = menu_views.menu_id')
            .select('stores.name AS storeName')
            .addSelect('menus.id AS menuId')
            .addSelect('menus.name AS menuName')
            .addSelect('menus.menu_picture_url AS menuPictureUrl')
            .addSelect('menus.price AS sellingPrice')
            .addSelect('menus.discount_rate AS discountRate')
            .addSelect('menu_views.view_count AS viewCount')
            .getRawMany();
        for (const data of dataList) {
            const isExist = await this.dynamoModel.get({
                // dynamodb에 이미 데이터가 있는지 확인
                storeName: data.storeName,
                menuId: data.menuId,
            });
            if (!isExist) {
                // 데이터가 없다면 dynamodb에 넣기
                const insertData = {
                    storeName: data.storeName,
                    menuId: data.menuId,
                    menuName: data.menuName,
                    menuPictureUrl: data.menuPictureUrl,
                    sellingPrice: data.sellingPrice,
                    discountRate: data.discountRate,
                    viewCount: data.viewCount,
                };
                try {
                    await this.dynamoModel.create(insertData);
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
            }
        }
    }

    async initMockStores() {
        const owners: User[] = [
            new User({
                fId: 'owner0001',
                name: '김사장',
                role: Roles.OWNER,
                phone: '010-1234-1234',
            }),
            new User({
                fId: 'owner0002',
                name: '박사장',
                role: Roles.OWNER,
                phone: '010-1234-1234',
            }),
            new User({
                fId: 'owner0003',
                name: '최사장',
                role: Roles.OWNER,
                phone: '010-1234-1234',
            }),
            new User({
                fId: 'owner0004',
                name: '오사장',
                role: Roles.OWNER,
                phone: '010-1234-1234',
            }),
            new User({
                fId: 'owner0005',
                name: '윤사장',
                role: Roles.OWNER,
                phone: '010-1234-1234',
            }),
        ];

        const isExist = await this.usersRepository.exist({
            name: owners[owners.length - 1].name,
        });

        const dtos: CreateStoreDto[] = [
            {
                name: '고씨네',
                businessLeaderName: '김대표',
                address: '서울특별시 노원구 월계동 광운로 17-5',
                addressDetail: '1층',
                businessNum: '123-456-789',
                categories: [3],
                cookingTime: 20,
                operationTimes: {
                    startedAt: '11:00',
                    endedAt: '24:00',
                },
            },
            {
                name: '서민초밥',
                businessLeaderName: '김대표',
                address: '서울특별시 노원구 석계로3길 17-1',
                businessNum: '123-456-789',
                categories: [3],
                cookingTime: 35,
                operationTimes: {
                    startedAt: '10:00',
                    endedAt: '21:00',
                },
            },
            {
                name: '후문식당',
                businessLeaderName: '김대표',
                address: '서울특별시 노원구 석계로13길 25-1',
                addressDetail: '가든빌딩 지층 101호',
                businessNum: '123-456-789',
                categories: [3],
                cookingTime: 15,
                operationTimes: {
                    startedAt: '09:00',
                    endedAt: '21:00',
                },
            },
            {
                name: '베트남노상식당 광운대점',
                businessLeaderName: '김대표',
                address: '서울 노원구 광운로 46',
                addressDetail: '대동아파트상가 112, 113호',
                businessNum: '123-456-789',
                categories: [3],
                cookingTime: 15,
                operationTimes: {
                    startedAt: '09:00',
                    endedAt: '21:00',
                },
            },
            {
                name: '맛닭꼬 광운대점',
                businessLeaderName: '김대표',
                address: '서울 노원구 광운로 61',
                businessNum: '123-456-789',
                categories: [3],
                cookingTime: 15,
                operationTimes: {
                    startedAt: '09:00',
                    endedAt: '21:00',
                },
            },
        ];

        if (!isExist) {
            let i = 0;

            for (const dto of dtos) {
                const user = await this.usersRepository.create(owners[i]);
                await this.storesRepository.createStore(user, dto);
                i++;
            }
        }
    }

    async basicInfo(storeId: number) {
        let query =
            'SELECT s.name AS name, s.status, bd.name AS businessLeaderName, c.name AS category, sd.store_picture_url AS storePictureUrl, ';
        query += 'COUNT(m.id) AS totalMenuCount, IFNULL(SUM(m.sale_price < price), 0) discountMenuCount, ';
        query +=
            't.id AS tag_id, t.name AS tag_name, t.content AS tag_content , t.description AS tag_description, t.text_color AS tag_textColor, t.background_color AS tag_backgroundColor, t.icon AS tag_icon ';
        query += 'FROM stores AS s ';
        query += 'LEFT JOIN store_detail sd ON sd.store_id = s.id ';
        query += 'LEFT JOIN tags t ON t.id = s.tag_id ';
        query += 'LEFT JOIN business_detail bd ON bd.store_id = s.id ';
        query += 'LEFT JOIN store_categories sc ON sc.stores_id = s.id ';
        query += 'LEFT JOIN categories c ON sc.categories_id = c.id ';
        query += 'LEFT JOIN menus m ON m.store_id = s.id ';
        query += 'WHERE s.id = ? ';
        query += 'group by s.name, s.status, bd.name, c.name, sd.store_picture_url';

        const sql = await this.entityManager.query(query, [storeId]);
        const tag = {
            id: sql[0].tag_id,
            name: sql[0].tag_name,
            description: sql[0].tag_description,
            icon: sql[0].tag_icon,
            content: sql[0].tag_content,
            textColor: sql[0].tag_textColor,
            backgroundColor: sql[0].tag_backgroundColor,
        };

        const info = {
            name: sql[0].name,
            status: sql[0].status,
            businessLeaderName: sql[0].businessLeaderName,
            category: sql[0].category,
            storePictureUrl: sql[0].storePictureUrl,
            totalMenuCount: sql[0].totalMenuCount,
            discountMenuCount: sql[0].discountMenuCount,
            tag,
        };

        return info;
    }
}
