import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { CommonException } from 'src/global/exception/common.exception';

import { SignInDto, SignUpDto, ReissueTokensDto } from './dto/auth.dto';
import { User } from 'src/users/entity/user.entity';
import { Token } from 'src/auth/entity/auth.entity';
import { TokensModel } from './model/auth.model';
import { TokensRepository } from './auth.repository';
import { Roles } from 'src/users/enum/roles.enum';
import { jwtConstants } from './config/jwtConstants';

@Injectable()
export class AuthService {
    constructor(
        private readonly tokensRepository: TokensRepository,
        private readonly jwtService: JwtService,
        private readonly logger: Logger,
        private readonly dataSource: DataSource,
    ) {}

    public async signUpAndIssueTokens(role: Roles, dto: SignUpDto): Promise<TokensModel> {
        let userEntity = new User({ ...dto, role });
        let tokenEntity = new Token({ fId: dto.fId, refreshToken: null });

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            await queryRunner.manager.getRepository(User).save(userEntity);
            await queryRunner.manager.getRepository(Token).save(tokenEntity);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            this.logger.error(e);
            throw new CommonException(1000, 'failed to sign up');
        } finally {
            await queryRunner.release();
            userEntity = null;
            tokenEntity = null;
        }

        const tokenModel = this.issueTokens(dto);

        try {
            await this.tokensRepository.findOneAndUpdate({ fId: dto.fId }, { refreshToken: tokenModel.refreshToken });
        } catch (e) {
            this.logger.error(e);
            throw new CommonException(1001, 'failed to update tokens');
        }

        return {
            ...tokenModel,
        };
    }

    public issueTokens(dto: SignUpDto | SignInDto | ReissueTokensDto): TokensModel {
        let id: string;
        if ('fId' in dto) {
            id = dto.fId;
        } else {
            const accessToken = this.jwtService.decode(dto.accessToken.replace('Bearer ', ''));
            id = accessToken['id'];
        }
        const payload = { id: id };

        const accessToken = this.generateToken(payload, jwtConstants.ACCESS_SECRET, jwtConstants.ACCESS_EXPIRES);
        const refreshToken = this.generateToken(payload, jwtConstants.REFRESH_SECRET, jwtConstants.REFRESH_EXPIRES);

        const accessTokenExp = this.expiresToken(accessToken);
        const refreshTokenExp = this.expiresToken(refreshToken);

        return {
            accessToken,
            refreshToken,
            accessTokenExp,
            refreshTokenExp,
        };
    }

    private generateToken = (payload: any, secret: string, expiresIn: string) => {
        return this.jwtService.sign(payload, { secret, expiresIn });
    };

    private expiresToken = (token: string) => {
        return new Date(
            new Date(this.jwtService.decode(token.replace('Bearer ', ''))['exp'] * 1000).getTime() -
                new Date().getTimezoneOffset() * 60 * 1000,
        );
    };
}
