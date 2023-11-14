import { Injectable } from '@nestjs/common';
import { StoresRepository } from './stores.repository';
import { Store } from './entity/store.entity';
import { Roles } from 'src/users/enum/roles.enum';
import { CreateStoreDto } from './dto/create-store.dto';
import { FindStoresDto } from './dto/find-stores.dto';
import { FindOneStoreDto } from './dto/find-one-store.dto';
import { User } from 'src/users/entity/user.entity';
import { StoresException } from 'src/global/exception/stores-exception';

@Injectable()
export class StoresService {
    constructor(private readonly storesRepository: StoresRepository) {}

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
}
