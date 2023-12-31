import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { EntityManager, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
    protected abstract readonly logger: Logger;

    constructor(
        private readonly entityRepository: Repository<T>,
        private readonly entityManager: EntityManager,
    ) {}

    async exist(where: FindOptionsWhere<T>): Promise<boolean> {
        return this.entityRepository.exist({ where });
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

        if (!entity) {
            this.logger.warn('Entity not found with where', where);
            throw new NotFoundException('Entity not found.');
        }

        return entity;
    }

    async findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T> {
        const updateResult = await this.entityRepository.update(where, partialEntity);

        if (!updateResult.affected) {
            this.logger.warn('Entity not found with where', where);
            throw new NotFoundException('Entity not found');
        }

        return this.findOne(where);
    }

    async find(where?: FindOptionsWhere<T>) {
        return this.entityRepository.findBy(where);
    }

    async findOneAndDelete(where: FindOptionsWhere<T>) {
        await this.entityRepository.softDelete(where);
    }
}
