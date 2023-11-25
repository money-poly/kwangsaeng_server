import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from 'src/global/common/abstract.repository';
import { Menu } from './entity/menu.entity';

@Injectable()
export class MenusRepository extends AbstractRepository<Menu> {
    protected readonly logger = new Logger(MenusRepository.name);

    constructor(
        @InjectRepository(Menu)
        menusRepository: Repository<Menu>,
        entityManager: EntityManager,
    ) {
        super(menusRepository, entityManager);
    }
}
