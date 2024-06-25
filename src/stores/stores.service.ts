import { EntityManager, FindManyOptions, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StoresException } from 'src/global/exception/stores-exception';
import { TagException } from 'src/global/exception/tag-exception';
import { mockOwners, mockStores } from 'src/global/common/mock.constant';
import { CategoriesException } from 'src/global/exception/categories-exception';
import { UsersRepository } from 'src/users/users.repository';
import { Seller } from 'src/users/entity/seller.entity';
import { StoresRepository } from 'src/stores/stores.repository';
import { Store } from 'src/stores/entity/store.entity';
import { CreateStoreDto } from 'src/stores/dto/create-store.dto';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { FindStoreWithLocationDto } from 'src/stores/dto/find-store-with-location.dto';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { StoreStatus } from 'src/stores/enum/store-status.enum';
import { UpdateStoreDto } from 'src/stores/dto/update-store.dto';
import { FindStoreDetailDto } from 'src/stores/dto/find-store-detail.dto';
import { StoreApproveStatus } from 'src/stores/enum/store-approve-status.enum';
import { Menu } from 'src/menus/entity/menu.entity';
import { MenusService } from 'src/menus/menus.service';
import { MenuStatus } from 'src/menus/enum/menu-status.enum';
import { TagsService } from 'src/tags/tags.service';
import { CategoriesService } from 'src/categories/categories.service';
import { ResponseRefiner } from 'src/global/util/response-refiner';
import { FindStoreRes } from './dto/refine-response.dto';
import { measurePickUpTime } from './util/measure-pickup-time';
import { CAUTION_TEXT } from 'src/global/common/caution.constant';

@Injectable()
export class StoresService {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly categoriesService: CategoriesService,
        private readonly entityManager: EntityManager,
        private readonly menusService: MenusService,
        private readonly usersRepository: UsersRepository,
        private readonly tagsService: TagsService,
    ) {}

    async existStore(where: FindManyOptions<Store>) {
        return await this.storesRepository.existStore(where);
    }

    async createStore(user: Seller, dto: CreateStoreDto) {
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

    async updateStore(storeId: number, dto: UpdateStoreDto) {
        let tag;
        const categories = [];

        if (dto.phone === null) {
            throw StoresException.NOT_ACCEPT_UPDATE_PHONE;
        }

        if (dto.address === null) {
            throw StoresException.NOT_ACCEPT_UPDATE_ADDRESS;
        }

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

        if (dto?.categories) {
            dto.categories.forEach(async (categoryId) => {
                const category = await this.categoriesService.findOneSub({ id: categoryId });
                if (!category) {
                    throw CategoriesException.SUB_NOT_FOUND;
                }
                categories.push(category);
            });
        }

        const store = await this.storesRepository.findOneStore(
            { id: storeId },
            {
                id: true,
                name: true,
                detail: {
                    id: true,
                    address: true,
                    addressDetail: true,
                    description: true,
                    operationTimes: { endedAt: true, startedAt: true },
                    cookingTime: true,
                    storePictureUrl: true,
                    phone: true,
                },
            },
            { detail: true, tag: true, categories: true },
        );

        const refinedStore = {
            id: store.id,
            name: dto.name ?? store.name,
            detail: {
                ...store.detail,
                address: dto.address ?? store.detail.address,
                phone: dto.phone ?? store.detail.phone,
                operationTimes: dto.operationTimes ?? store.detail.operationTimes,
                cookingTime:
                    dto.cookingTime === undefined
                        ? store.detail.cookingTime
                        : dto.cookingTime === null
                          ? null
                          : dto.cookingTime,
                description:
                    dto.description === undefined
                        ? store.detail.description
                        : dto.description === null
                          ? null
                          : dto.description,
                addressDetail:
                    dto.addressDetail === undefined
                        ? store.detail.addressDetail
                        : dto.addressDetail === null
                          ? null
                          : dto.addressDetail,
                storePictureUrl:
                    dto.storePictureUrl === undefined
                        ? store.detail.storePictureUrl
                        : dto.storePictureUrl === null
                          ? null
                          : dto.storePictureUrl,
            },
            tag: tag ?? store.tag,
            categories: categories ?? store.categories,
        };

        return await this.storesRepository.saveStore(refinedStore);
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
            .select('s.name', 'name')
            .addSelect('sd.store_picture_url', 'storePictureUrl')
            .addSelect('sd.description', 'description')
            .addSelect('COALESCE(MAX(m.discount_rate), 0)', 'maxDiscount')
            .where('s.id = :storeId', { storeId })
            .andWhere('m.status = :status', { status: MenuStatus.SALE })
            .groupBy('s.id')
            .addGroupBy('sd.id')
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

        let menus = [];
        let refinedOrder = null;
        const orderBy = await this.storesRepository.processOrderBy(store);
        if (orderBy) {
            menus = await this.menusService.findMenusForOrder(store, orderBy);
            refinedOrder = storeData.detail.menuOrders.join(',');
        }

        return ResponseRefiner.refineObject(
            {
                store: storeData,
                categories,
                menus,
                pickUpTime: await measurePickUpTime(
                    storeData.detail.cookingTime,
                    storeData.detail.lat,
                    lat,
                    storeData.detail.lon,
                    lon,
                ),
                refinedOrder,
                caution: CAUTION_TEXT,
            },
            FindStoreRes,
        );
    }

    async findStoresWithLocation(dto: FindStoreWithLocationDto) {
        return await this.entityManager
            .createQueryBuilder(Store, 'stores')
            .leftJoinAndSelect(StoreDetail, 'd', 'stores.id = d.store_id')
            .leftJoinAndSelect(StoreApprove, 'a', 'stores.id = a.store_id')
            .select('stores.id', 'id')
            .addSelect('name', 'name')
            .addSelect('CAST(d.lat AS FLOAT)', 'lat')
            .addSelect('CAST(d.lon AS FLOAT)', 'lon')
            .where(
                'ST_DWithin(ST_SetSRID(ST_MakePoint(lon, lat), 4326), ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), :range)',
                { longitude: dto.lon, latitude: dto.lat, range: dto.range },
            )
            .andWhere('stores.status = :openStatus', { openStatus: StoreStatus.OPEN })
            .andWhere('a.isApproved = :approveStatus', { approveStatus: StoreApproveStatus.DONE })
            .getRawMany();
    }

    async findStoreUsingToken(userId: number) {
        return await this.entityManager
            .createQueryBuilder(Store, 's')
            .leftJoinAndSelect(Seller, 'u', 's.user_id = u.id')
            .select('s.id', 'id')
            .where('u.id = :userId', { userId })
            .getRawMany();
    }

    async initMockStores() {
        const owners: Seller[] = mockOwners;

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
            },
            { detail: true, businessDetail: true, menus: true, tag: true },
        );

        const categories = await this.categoriesService.findCategoriesNameByStore(store);

        const refinedStore = {
            name: store.name,
            status: store.status,
            businessLeaderName: store.businessDetail.name,
            category: categories.map((item) => {
                return { name: item.categoryName };
            }),
            storePictureUrl: store.detail ? store.detail.storePictureUrl : null,
            totalMenuCount: store.menus.length,
            discountMenuCount: store.menus.filter((menu) => menu.discountRate !== 0).length,
            tag: store.tag,
        };

        return refinedStore;
    }
}
