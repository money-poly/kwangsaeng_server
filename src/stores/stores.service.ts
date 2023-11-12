import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { StoresRepository } from './stores.repository';
import { Store } from './entity/store.entity';
import { UsersRepository } from 'src/users/users.repository';
import { Roles } from 'src/users/enum/roles.enum';
import { CreateStoreDto } from './dto/create-store.dto';
import { FindStoresDto } from './dto/find-stores.dto';
import { FindOneStoreDto } from './dto/find-one-store.dto';

@Injectable()
export class StoresService {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly usersRepository: UsersRepository,
    ) {}

    async create(dto: CreateStoreDto) {
        await this.validateCreateStoreDto(dto);
        const user = await this.validateUserRole(dto);

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

    private async validateCreateStoreDto(dto: CreateStoreDto) {
        const isExist = await this.storesRepository.exist({ name: dto.name });
        if (isExist) throw new UnprocessableEntityException('이미 존재하는 가게 이름입니다.');
    }

    private async validateUserRole(dto: CreateStoreDto) {
        const user = await this.usersRepository.findOne({ id: dto.userId });

        if (user.role != Roles.OWNER) throw new ForbiddenException('가게 생성 권한이 없습니다.');

        return user;
    }
}
