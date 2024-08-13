import { Logger } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
    EntityManager,
    EntityTarget,
    FindOptionsRelations,
    FindOptionsSelect,
    FindOptionsWhere,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { Store } from 'src/stores/entity/store.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Menu } from 'src/menus/entity/menu.entity';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
    protected abstract readonly logger: Logger;

    constructor(
        private readonly entityRepository: Repository<T>,
        private readonly entityManager: EntityManager,
    ) {}

    async exists(where: FindOptionsWhere<T>): Promise<boolean> {
        return this.entityRepository.exists({ where });
    }

    async create(entity: T): Promise<T> {
        return this.entityRepository.save(entity);
    }

    async findOne(
        where: FindOptionsWhere<T>,
        relations?: FindOptionsRelations<T>,
        select?: FindOptionsSelect<T>,
    ): Promise<T> {
        const entity = await this.entityRepository.findOne({ select, where, relations });

        return entity;
    }

    async findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T> {
        const updateResult = await this.entityRepository.update(where, partialEntity);

        return this.findOne(where);
    }

    async find(where?: FindOptionsWhere<T>) {
        return this.entityRepository.findBy(where);
    }

    async findOneAndDelete(where: FindOptionsWhere<T>) {
        await this.entityRepository.softDelete(where);
    }

    createQueryBuilder<E extends T>(entityClass: EntityTarget<E>): SelectQueryBuilder<E> {
        let alias;
        switch (entityClass) {
            case Menu:
                alias = 'm';
                break;
            case Store:
                alias = 's';
                break;
            case MenuView:
                alias = 'mv';
                break;
            case StoreDetail:
                alias = 'sd';
                break;
            case StoreApprove:
                alias = 'sa';
                break;
        }
        return this.entityManager.createQueryBuilder(entityClass, alias);
    }
}
