import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

import { User } from 'src/users/entity/user.entity';
import { Token } from 'src/auth/entity/token.entity';
import { TokensModel } from './model/auth.model';
import { TokensRepository } from './auth.repository';
import { UsersRepository } from 'src/users/users.repository';
import { Roles } from 'src/users/enum/roles.enum';
import { AuthException } from 'src/global/exception/auth-exception';
import { SignUpDto } from './dto/sign-up.dto';
import { ReissueTokensDto } from './dto/reissue-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UsersException } from 'src/global/exception/users-exception';

@Injectable()
export class AuthService {
    constructor(
        private readonly tokensRepository: TokensRepository,
        private readonly usersRepository: UsersRepository,
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
            throw UsersException.FAIL_SAVE_USER;
        } finally {
            await queryRunner.release();
            userEntity = null;
            tokenEntity = null;
        }

        const tokenModel = await this.issueTokens(dto);

        try {
            await this.tokensRepository.findOneAndUpdate({ fId: dto.fId }, { refreshToken: tokenModel.refreshToken });
        } catch (e) {
            this.logger.error(e);
            throw AuthException.FAIL_UPDATE_TOKEN;
        }

        return {
            ...tokenModel,
        };
    }

    public async issueTokens(dto: SignUpDto | SignInDto | ReissueTokensDto): Promise<TokensModel> {
        const fId = this.extractfIdFromDto(dto);
        const user = await this.validateUserByfId(fId);

        const payload = { ...user };

        const accessToken = this.generateToken(payload, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRES);
        const refreshToken = this.generateToken(
            payload,
            process.env.JWT_REFRESH_SECRET,
            process.env.JWT_REFRESH_EXPIRES,
        );

        const accessTokenExp = this.getExpiredTime(accessToken);
        const refreshTokenExp = this.getExpiredTime(refreshToken);

        return {
            accessToken,
            refreshToken,
            accessTokenExp,
            refreshTokenExp,
        };
    }

    private extractfIdFromDto = (dto: SignUpDto | SignInDto | ReissueTokensDto): string => {
        let id: string;
        if ('fId' in dto) {
            id = dto.fId;
        } else if ('accessToken' in dto) {
            const accessToken = this.jwtService.decode(dto.accessToken.replace('Bearer ', ''));
            id = accessToken['fId'];
        }
        return id;
    };

    private validateUserByfId = async (id: string): Promise<User> => {
        const user = await this.usersRepository.findOne({ fId: id });
        if (!user) throw UsersException.NOT_EXIST_USER;
        return user;
    };

    private generateToken = (payload: any, secret: string, expiresIn: string) => {
        return this.jwtService.sign(payload, { secret, expiresIn });
    };

    private getExpiredTime = (token: string): Date => {
        const decodedToken = this.jwtService.decode(token.replace('Bearer ', ''));
        if (decodedToken && decodedToken['exp']) {
            const timezoneExpiredTime = new Date(decodedToken['exp'] * 1000).getTime();
            const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
            return new Date(timezoneExpiredTime - timezoneOffset);
        } else {
            throw AuthException.FAIL_EXTRACT_TOKEN_EXPRIED_TIME;
        }
    };
}
