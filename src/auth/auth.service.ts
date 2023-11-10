import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommonException } from 'src/global/exception/common.exception';

import { SignInDto, SignUpDto, RefeshAccessTokenDto } from './dto/auth.dto';
import { User } from 'src/users/entity/user.entity';
import { Token } from 'src/auth/entity/auth.entity';
import { AccessTokenModel, TokensModel } from './model/auth.model';
import { jwtConstants } from './config/secretkey';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private readonly jwtService: JwtService,
        private readonly logger: Logger,
        private readonly dataSource: DataSource,
    ) {}

    public async signUpAndIssueTokens(dto: SignUpDto): Promise<TokensModel> {
        const userEntity = new User();
        const tokenEntity = new Token();
        userEntity.fId = dto.fId;
        tokenEntity.fId = dto.fId;

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
            throw new CommonException(999, 'failed to sign up');
        } finally {
            await queryRunner.release();
            delete userEntity.fId;
            delete tokenEntity.fId;
        }

        const tokenModel = this.issueTokens(dto);

        try {
            await this.tokenRepository.update({ fId: dto.fId }, { refreshToken: tokenModel.refreshToken });
        } catch (e) {
            this.logger.error(e);
            throw new CommonException(999, 'failed to token update');
        }

        return {
            ...tokenModel,
        };
    }

    public issueTokens(user: SignInDto | SignUpDto): TokensModel {
        const payload = { id: user.fId };

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

    public issueAccessToken(dto: RefeshAccessTokenDto): AccessTokenModel {
        const tokenEntity = new Token();
        try {
            const accessToken = this.jwtService.decode(dto.accessToken.replace('Bearer ', ''));
            tokenEntity.fId = accessToken['id'];
        } catch (e) {
            throw new CommonException(999, 'failed to read token');
        }

        const payload = { id: tokenEntity.fId };
        const newAccessToken = this.generateToken(payload, jwtConstants.ACCESS_SECRET, jwtConstants.ACCESS_EXPIRES);
        const newAccessTokenExp = this.expiresToken(newAccessToken);

        return {
            accessToken: newAccessToken,
            accessTokenExp: newAccessTokenExp,
        };
    }
}
