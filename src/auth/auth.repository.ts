import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/global/common/abstract.repository';
import { Token } from './entity/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TokensRepository extends AbstractRepository<Token> {
    protected readonly logger = new Logger(TokensRepository.name);

    constructor(
        @InjectRepository(Token)
        tokensRepository: Repository<Token>,
        entityManager: EntityManager,
    ) {
        super(tokensRepository, entityManager);
    }
}
