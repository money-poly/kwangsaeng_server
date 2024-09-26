import { Injectable } from '@nestjs/common';
import { Menus2Repository } from '../menus2.repository';
import { Seller } from 'src/users/entity/seller.entity';
import { CreateMenuDto } from 'src/menus/dto/create-menu.dto';
import { Menus2Reader } from './menus2.reader';
import { Stores2Reader } from 'src/stores2.0/implement/stores2.reader';
import { Stores2Validator } from 'src/stores2.0/implement/stores2.validator';
import { Menus2Validator } from './menus2.validator';
import { Menu } from 'src/menus/entity/menu.entity';
import { Stores2Appender } from 'src/stores2.0/implement/stores2.appender';
import { EntityManager } from 'typeorm';

@Injectable()
export class Menus2Appender {
    constructor(
        private readonly menusRepository: Menus2Repository,
        private readonly menusReader: Menus2Reader,
        private readonly menusValidator: Menus2Validator,
        private readonly storeReader: Stores2Reader,
        private readonly storeValidator: Stores2Validator,
        private readonly storeAppender: Stores2Appender,
        private readonly entityManager: EntityManager,
    ) {}

    async create(user: Seller, arg: CreateMenuDto) {
        return await this.entityManager.transaction(async (transactionalEntityManager) => {
            const store = await this.storeReader.readOneByUser(user.id);
            await this.storeValidator.checkExist(store);

            this.menusValidator.checkCreatePermission(user, store);

            // Menu 객체 생성 및 저장
            const createdMenu = new Menu({ ...arg, store });
            await transactionalEntityManager.save(createdMenu); // 트랜잭션 내에서 엔티티 저장

            // 메뉴 순서(order) 업데이트
            await this.storeAppender.addMenuOrder(store, createdMenu.id);

            return createdMenu;
        });
    }
}
