import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/global/common/abstract.repository';
import { Store } from './entity/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class StoresRepository extends AbstractRepository<Store> {
    protected readonly logger = new Logger(StoresRepository.name);

    constructor(
        @InjectRepository(Store)
        storesRepository: Repository<Store>,
        entityManager: EntityManager,
    ) {
        super(storesRepository, entityManager);
    }
}
