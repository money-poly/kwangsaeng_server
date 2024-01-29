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
import { TagsService } from 'src/tags/tags.service';
import { TagException } from 'src/global/exception/tag-exception';
import { FindOneStoreReturnValue } from './interfaces/find-one-store-return-value.interface';
import { mockOwners, mockStores } from 'src/global/common/mock.constant';

@Injectable()
export class StoresService {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly entityManager: EntityManager,
        private readonly usersRepository: UsersRepository,
        private readonly tagsService: TagsService,
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
        let tag;

        if (dto?.tagId) {
            tag = await this.tagsService.findOne({
                where: {
                    id: dto.tagId,
                },
            });

            if (!tag) {
                throw TagException.NOT_FOUND;
            }
        }

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
            tag: tag ?? store.tag,
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

    async findStore(store: Store, dto: FindStoreDetailDto) {
        const { lat, lon } = dto;
        const orderBy = await this.storesRepository.processOrderBy(store);
        // 메뉴 순서가 존재하지 않을때 == 메뉴가 존재하지 않기때문에 스토어 정보만 보내줌
        if (!orderBy) {
            const storeDataIncludedDetail = await this.entityManager
                .createQueryBuilder(Store, 's')
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
                .where('s.id = :storeId', { storeId: store.id })
                .andWhere('sa.is_approved = :isApproved', { isApproved: StoreApproveStatus.DONE })
                .getRawMany();

            const categories = [];
            storeDataIncludedDetail.forEach((data) => {
                categories.push(data.category);
            });

            const pickupTime = await this.storesRepository.measurePickUpTime(
                storeDataIncludedDetail[0].cookingTime,
                lat,
                storeDataIncludedDetail[0].lat,
                lon,
                storeDataIncludedDetail[0].lon,
            );

            const result: FindOneStoreReturnValue = {
                id: storeDataIncludedDetail[0].storeId,
                name: storeDataIncludedDetail[0].storeName,
                categories,
                detail: {
                    address: storeDataIncludedDetail[0].address,
                    addressDetail: storeDataIncludedDetail[0].addressDetail,
                    lat: storeDataIncludedDetail[0].lat,
                    lon: storeDataIncludedDetail[0].lon,
                    phone: storeDataIncludedDetail[0].phone,
                    cookingTime: storeDataIncludedDetail[0].cookingTime,
                    operationTimes: storeDataIncludedDetail[0].operationTimes,
                    pickupTime,
                    menuOrders: storeDataIncludedDetail[0].menuOrders,
                },
                menus: [],
            };
            return result;
        }

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
            .where('s.id = :storeId', { storeId: store.id })
            .andWhere('sa.is_approved = :isApproved', { isApproved: StoreApproveStatus.DONE })
            .orderBy(orderBy, 'DESC')
            .getRawMany();

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

        const pickupTime = await this.storesRepository.measurePickUpTime(
            dataList[0].cookingTime,
            lat,
            dataList[0].lat,
            lon,
            dataList[0].lon,
        );

        const storeIncludedMenu: FindOneStoreReturnValue = {
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
                pickupTime,
                menuOrders: dataList[0].menuOrders,
            },
            menus: menuList,
        };

        return storeIncludedMenu;
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

    async findStoreUsingToken(userId: number) {
        return await this.entityManager
            .createQueryBuilder(Store, 's')
            .leftJoinAndSelect(User, 'u', 's.user_id = u.id')
            .select('s.id AS id')
            .where('u.id = :userId', { userId })
            .getRawMany();
    }

    async migrateDynamo() {
        const dataList = await this.entityManager
            .createQueryBuilder(Menu, 'm')
            .leftJoinAndSelect(Store, 's', 's.id = m.store_id')
            .leftJoinAndSelect(MenuView, 'mv', 'm.id = mv.menu_id')
            .select('s.name AS storeName')
            .addSelect('m.id AS menuId')
            .addSelect('s.id AS storeId')
            .addSelect('m.name AS menuName')
            .addSelect('m.menu_picture_url AS menuPictureUrl')
            .addSelect('m.price AS sellingPrice')
            .addSelect('m.discount_rate AS discountRate')
            .addSelect('mv.view_count AS viewCount')
            .getRawMany();
        for (const data of dataList) {
            const isExist = await this.dynamoModel.get({
                // dynamodb에 이미 데이터가 있는지 확인
                menuId: data.menuId,
                storeName: data.storeName,
            });
            if (!isExist) {
                // 데이터가 없다면 dynamodb에 넣기
                const insertData = {
                    storeName: data.storeName,
                    menuId: data.menuId,
                    storeId: data.storeId,
                    menuName: data.menuName,
                    menuPictureUrl: data.menuPictureUrl ? data.menuPictureUrl : undefined,
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
        const owners: User[] = mockOwners;

        const isExist = await this.usersRepository.exist({
            name: owners[owners.length - 1].name,
        });

        const dtos: CreateStoreDto[] = mockStores;
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
