import { EntityManager, FindManyOptions, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { UsersRepository } from './../users/users.repository';
import { Injectable } from '@nestjs/common';
import { StoresRepository } from './stores.repository';
import { Store } from './entity/store.entity';
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
import { FindStoreDetailDto } from './dto/find-store-detail.dto';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { StoreApproveStatus } from './enum/store-approve-status.enum';
import { TagsService } from 'src/tags/tags.service';
import { TagException } from 'src/global/exception/tag-exception';
import { mockOwners, mockStores } from 'src/global/common/mock.constant';
import { CategoriesService } from 'src/categories/categories.service';
import { MenusService } from 'src/menus/menus.service';
import { FindOneStoreReturnValue } from './interfaces/find-one-store-return-value.interface';

@Injectable()
export class StoresService {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly categoriesService: CategoriesService,
        private readonly entityManager: EntityManager,
        private readonly menusService: MenusService,
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
                phone: dto.phone ?? store.detail.storePictureUrl,
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
        const storeData: Store = await this.storesRepository.findOneStore(
            { id: store.id, approve: { isApproved: StoreApproveStatus.DONE } },
            {
                id: true,
                name: true,
                detail: {
                    description: true,
                    storePictureUrl: true,
                    address: true,
                    addressDetail: true,
                    lat: true,
                    lon: true,
                    cookingTime: true,
                    operationTimes: { startedAt: true, endedAt: true },
                    menuOrders: true,
                    phone: true,
                },
            },
            { detail: true, approve: true },
        );
        if (!storeData) {
            throw StoresException.ENTITY_NOT_FOUND;
        }

        const categories = await this.categoriesService.findCategoriesNameByStore(store);
        const refinedCategories = categories.map((item) => {
            return { name: item.categoryName };
        });

        let menus = [];
        let refinedOrder = null;
        const orderBy = await this.storesRepository.processOrderBy(store);
        if (orderBy) {
            menus = await this.menusService.findMenusForOrder(store, orderBy);
            refinedOrder = storeData.detail.menuOrders.join(',');
        }

        const pickUpTime = await this.storesRepository.measurePickUpTime(
            storeData.detail.cookingTime,
            storeData.detail.lat,
            lat,
            storeData.detail.lon,
            lon,
        );

        const refinedReturnValue: FindOneStoreReturnValue = {
            id: storeData.id,
            name: storeData.name,
            categories: refinedCategories,
            detail: { ...storeData.detail, pickUpTime, menuOrders: refinedOrder },
            menus,
        };
        return refinedReturnValue;
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
        const store = await this.storesRepository.findOneStore(
            { id: storeId },
            {
                id: true,
                name: true,
                status: true,
                businessDetail: {
                    name: true,
                },
                detail: {
                    storePictureUrl: true,
                },
                tag: {
                    id: true,
                    name: true,
                    description: true,
                    icon: true,
                    content: true,
                    textColor: true,
                    backgroundColor: true,
                },
                menus: {
                    id: true,
                    discountRate: true,
                },
                categories: {
                    name: true,
                },
            },
            { categories: true, detail: true, businessDetail: true, menus: true, tag: true },
        );

        const refinedStore = {
            name: store.name,
            status: store.status,
            businessLeaderName: store.businessDetail.name,
            category: store.categories,
            storePictureUrl: store.detail ? store.detail.storePictureUrl : null,
            totalMenuCount: store.menus.length,
            discountMenuCount: store.menus.filter((menu) => menu.discountRate !== 0).length,
            tag: store.tag,
        };

        return refinedStore;
    }
}
