import { EntityManager } from 'typeorm';
import { UsersRepository } from './../users/users.repository';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { StoresRepository } from './stores.repository';
import { Store } from './entity/store.entity';
import { Roles } from 'src/users/enum/roles.enum';
import { CreateStoreDto } from './dto/create-store.dto';
import { FindStoresDto } from './dto/find-stores.dto';
import { FindOneStoreDto } from './dto/find-one-store.dto';
import { User } from 'src/users/entity/user.entity';
import { StoresException } from 'src/global/exception/stores-exception';
import { FindStoreWithLocationDto } from './dto/find-store-with-location.dto';

@Injectable()
export class StoresService implements OnModuleInit {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly entityManager: EntityManager,
        private readonly usersRepository: UsersRepository,
    ) {}

    async onModuleInit() {
        await this.createMockStoreData();
    }

    async create(user: User, dto: CreateStoreDto) {
        await this.validateStoreName(user, dto);
        await this.validateUserRole(user, Roles.OWNER);

        const newStore = new Store({
            ...dto,
            user,
        });

        return await this.storesRepository.create(newStore);
    }

    async findOne(dto: FindOneStoreDto) {
        return this.storesRepository.findOne(dto, { user: true });
    }

    async findStoresWithLocation(dto: FindStoreWithLocationDto) {
        const { lat, lon, range } = dto;

        return await this.entityManager
            .createQueryBuilder(Store, 'stores')
            .select('name')
            .addSelect('id')
            .addSelect('address')
            .addSelect('CAST(latitude AS FLOAT) AS latitude')
            .addSelect('CAST(longitude AS FLOAT) AS longitude')
            .addSelect(
                `CAST(ST_Distance_Sphere(POINT(${lon}, ${lat}), POINT(longitude, latitude)) AS FLOAT) AS distance`,
            )
            .where(`ST_Distance_Sphere(POINT(${lon}, ${lat}), POINT(longitude, latitude)) <= ${range}`)
            .orderBy('distance')
            .getRawMany();
    }

    async find(dto: FindStoresDto) {
        return await this.storesRepository.find(dto);
    }

    private async validateStoreName(user: User, dto: CreateStoreDto) {
        const isExist = await this.storesRepository.exist({ name: dto.name });
        if (isExist) throw StoresException.ALREADY_EXIST_STORE_NAME;
    }

    private async validateUserRole(user: User, role: Roles) {
        // TODO: 토큰 로직 문제로 인해 기능 구현 잠시 보류
        if (user?.role != role) throw StoresException.HAS_NO_PERMISSION_CREATE;
    }

    private async createMockStoreData() {
        const names = [
            '후문식당',
            '고씨네',
            '베트남노상식당 광운대점',
            '청년다방 광운대점',
            '서브웨이 광운대점',
            '화로상회 광운대점',
            '무명칼국수',
            '육회공작소',
            '엄마마늘보쌈',
            '서민초밥',
            '스시다온',
        ];

        const latLon = [
            [37.6201, 127.0613],
            [37.6193, 127.0575],
            [37.6216, 127.0611],
            [37.6213, 127.0595],
            [37.6226, 127.0595],
            [37.6208, 127.0585],
            [37.6167, 127.0639],
            [37.6163, 127.0645],
            [37.6164, 127.0645],
            [37.6158, 127.0636],
            [37.613, 127.0644],
        ];

        const address = [
            '서울특별시 노원구 월계동 429-5번지 101호',
            '서울특별시 노원구 월계동 광운로 17-5',
            '서울특별시 노원구 월계동 411-28',
            '서울특별시 노원구 광운로 44 1층',
            '서울특별시 노원구 월계동 383-16번지 성북프라자 1층 102호',
            '서울특별시 노원구 월계1동 광운로 37',
            '서울특별시 노원구 월계동 68-79',
            '서울특별시 노원구 월계동 64-10',
            '서울특별시 노원구 월계동 64-9',
            '서울특별시 노원구 석계로3길 17-1',
            '서울특별시 성북구 석관동 133-95 1층',
        ];

        const isExist = await this.usersRepository.exist({
            name: '김사장',
        });

        if (!isExist) {
            let i = 0;

            const newOwner = new User({
                fId: 'owner0001',
                name: '김사장',
                role: Roles.OWNER,
                phone: '010-1234-1234',
            });

            const user = await this.usersRepository.create(newOwner);

            for (const name of names) {
                const mockStore = new Store({
                    name,
                    latitude: latLon[i][0],
                    longitude: latLon[i][1],
                    address: address[i++],
                    storePictureUrl:
                        'https://lh5.googleusercontent.com/p/AF1QipMt6zixIlfWNVnv9evhShsf9XmgDPLmXJ6KVnaS=w203-h152-k-no',
                    user,
                });

                await this.storesRepository.create(mockStore);
            }
        }
    }
}
