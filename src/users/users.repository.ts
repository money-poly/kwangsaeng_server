import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from 'src/global/common/abstract.repository';
import { Seller } from './entity/seller.entity';

@Injectable()
export class UsersRepository extends AbstractRepository<Seller> {
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(
        @InjectRepository(Seller)
        usersRepository: Repository<Seller>,
        entityManager: EntityManager,
    ) {
        super(usersRepository, entityManager);
    }
}
