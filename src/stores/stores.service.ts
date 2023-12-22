import { EntityManager, FindManyOptions, FindOptionsWhere } from 'typeorm';
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
            return await this.storesRepository.updateStore(store, { status: StoreStatus.CLOSED });
        } else {
            return await this.storesRepository.updateStore(store, { status: StoreStatus.OPEN });
        }
    }

    async findOneStore(where: FindOptionsWhere<Store>) {
        return await this.storesRepository.findOneStore(where);
    }

    async approve(store: Store) {
        const approve = await this.storesRepository.findOneApprove({
            store: {
                id: store.id,
            },
        });

        if (approve.isApproved) {
            throw StoresException.ALREADY_APPROVED;
        }

        return await this.storesRepository.approve(approve);
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
            .andWhere('stores.status = "open"')
            .andWhere('a.isApproved = true')
            .getRawMany();
    }

    async migrateDynamo() {
        const dataList = await this.entityManager
            .createQueryBuilder(Menu, 'menus')
            .leftJoinAndSelect(Store, 'stores', 'stores.id = menus.store_id')
            .select('stores.id')
            .addSelect('menus.id')
            .addSelect('menus.name')
            .addSelect('menus.menu_picture_url')
            .addSelect('menus.discount_rate')
            .addSelect('menus.price')
            .getRawMany();
        for (const data of dataList) {
            const isExist = await this.dynamoModel.get({
                // dynamodb에 이미 데이터가 있는지 확인
                store_id: data.menus_id,
                menu_id: data.menus_id,
            });
            if (!isExist) {
                // 데이터가 없다면 dynamodb에 넣기
                const insertData = {
                    store_id: data.menus_id,
                    menu_id: data.menus_id,
                    menu_name: data.menus_name,
                    menu_image: data.menus_picture_url,
                    menu_saleRate: data.menus_sale_rate,
                    menu_price: data.menus_price,
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
        const countryOfOrigin = [{ 닭고기: '국내산' }, { 김치: '국내산' }, { 고등어: '노르웨이산' }];

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
                lat: 37.6193,
                lon: 127.0575,
                address: '서울특별시 노원구 월계동 광운로 17-5',
                businessNum: '123-456-789',
                categories: [2],
                cookingTime: 20,
                operationTimes: {
                    startedAt: '11:00',
                    endedAt: '24:00',
                },
                phone: '010-1234-5678',
            },
            {
                name: '서민초밥',
                lat: 37.6158,
                lon: 127.0636,
                address: '서울특별시 노원구 석계로3길 17-1',
                businessNum: '123-456-789',
                categories: [2],
                cookingTime: 35,
                operationTimes: {
                    startedAt: '10:00',
                    endedAt: '21:00',
                },
                phone: '010-1234-5678',
            },
            {
                name: '후문식당',
                lat: 37.6201,
                lon: 127.0613,
                address: '서울특별시 노원구 석계로13길 25-1',
                businessNum: '123-456-789',
                categories: [2],
                cookingTime: 15,
                operationTimes: {
                    startedAt: '09:00',
                    endedAt: '21:00',
                },
                phone: '010-1234-5678',
            },
            {
                name: '베트남노상식당 광운대점',
                lat: 37.6216,
                lon: 127.0611,
                address: '서울 노원구 광운로 46 (월계동, 대동아파트) 대동아파트상가 112, 113호',
                businessNum: '123-456-789',
                categories: [2],
                cookingTime: 15,
                operationTimes: {
                    startedAt: '09:00',
                    endedAt: '21:00',
                },
                phone: '010-1234-5678',
            },
            {
                name: '맛닭꼬 광운대점',
                lat: 37.6229,
                lon: 127.0598,
                address: '서울 노원구 광운로 61 국민은행',
                businessNum: '123-456-789',
                categories: [2],
                cookingTime: 15,
                operationTimes: {
                    startedAt: '09:00',
                    endedAt: '21:00',
                },
                phone: '010-1234-5678',
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
}
