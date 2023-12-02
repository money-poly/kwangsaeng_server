import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { MenusRepository } from './menus.repository';
import { EntityManager } from 'typeorm';
import { UsersRepository } from 'src/users/users.repository';
import { Roles } from 'src/users/enum/roles.enum';
import { User } from 'src/users/entity/user.entity';
import { Menu } from './entity/menu.entity';
import { StoresRepository } from 'src/stores/stores.repository';
import { StoresService } from 'src/stores/stores.service';
import { StoresException } from 'src/global/exception/stores-exception';
import { CreateMenuArgs } from './interface/create-menu.interface';

@Injectable()
export class MenusService implements OnModuleInit {
    constructor(
        private readonly meunusRepository: MenusRepository,
        private readonly entityManager: EntityManager,
        private readonly usersRepository: UsersRepository,
        private readonly storesRepository: StoresRepository,
    ) {}

    async onModuleInit() {
        // await this.createMockMenuData();
    }

    async create(user: User, args: CreateMenuArgs) {}

    private async createMockMenuData() {
        const names = ['돈까스', '돈까스세트', '돈까스세트메밀국수', '돈까스세트메밀국수우동'];

        const sale_rates = [10, 20, 30, 40];

        const prices = [10000, 15000, 16000, 17000];

        const imageUrl = ['menuImage1', 'menuImage2', 'menuImage3', 'menuImage4'];

        const popularities = [1, 0, 0, 1];

        const status = ['Open', 'Close', 'Open', 'Close'];

        const countryOfOrigin = ['국내산 쌀', '국내산 고기', '국내산 메밀면', '국내산 우동면'];

        const descriptions = ['설명1', '설명2', '설명3', '설명4'];

        const storeId = [1, 2, 3, 4];

        let i = 0;

        for (const name of names) {
            const storeInfo = await this.storesRepository.findOne({ id: storeId[i] }, {}, { id: true });
            const mockMenu = new Menu({
                name,
                saleRate: sale_rates[i],
                price: prices[i],
                menuPictureUrl: imageUrl[i],
                popularity: Boolean(popularities[i]),
                status: status[i],
                expiredDate: new Date(),
                viewCount: 0,
                countryOfOrigin: countryOfOrigin[i],
                description: descriptions[i],
                store: storeInfo ? storeInfo : null,
            });
            i++;
            await this.meunusRepository.create(mockMenu);
        }
    }
}
