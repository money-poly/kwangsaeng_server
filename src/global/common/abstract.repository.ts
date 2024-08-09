import { Logger } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { EntityManager, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

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

    async findOneAndDelete(where: FindOptionsWhere<T>) {
        await this.entityRepository.softDelete(where);
    }
}
