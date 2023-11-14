import { Injectable } from '@nestjs/common';
import { StoresRepository } from './stores.repository';
import { Store } from './entity/store.entity';
import { UsersRepository } from 'src/users/users.repository';
import { Roles } from 'src/users/enum/roles.enum';
import { CreateStoreDto } from './dto/create-store.dto';
import { FindStoresDto } from './dto/find-stores.dto';
import { FindOneStoreDto } from './dto/find-one-store.dto';
import { User } from 'src/users/entity/user.entity';
import { CommonException } from 'src/global/exception/common.exception';

@Injectable()
export class StoresService {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly usersRepository: UsersRepository,
    ) {}

    async create(user: User, dto: CreateStoreDto) {
        await this.validateCreateStoreDto(user, dto);

        const newStore = new Store({
            ...dto,
            user,
        });

        return await this.storesRepository.create(newStore);
    }

    async findOne(dto: FindOneStoreDto) {
        return this.storesRepository.findOne(dto, { user: true });
    }

    async find(dto: FindStoresDto) {
        return await this.storesRepository.find(dto);
    }

    private async validateCreateStoreDto(user: User, dto: CreateStoreDto) {
        const isExist = await this.storesRepository.exist({ name: dto.name });
        if (isExist) throw new CommonException(2000, '이미 존재하는 가게 이름입니다.');

        // TODO: 토큰 로직 문제로 인해 기능 구현 잠시 보류
        if (user?.role != Roles.OWNER) throw new CommonException(2001, '가게 생성 권한이 없습니다.');
    }
}
