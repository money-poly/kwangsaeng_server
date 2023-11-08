import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommonException } from 'src/global/exception/common.exception';

import { SellerLoginDto, refeshAccessTokenDto } from './dto/auth.dto';
import { User } from 'src/users/entity/user.entity';
import { Token } from 'src/auth/entity/auth.entity';
import { AccessTokenModel, TokenModel } from './model/auth.model';
import { jwtConstants } from './config/secretkey';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
        private jwtService: JwtService,
        private readonly logger: Logger,
        private dataSource: DataSource,
    ) {}

    async signUpOrIn(dto: SellerLoginDto): Promise<TokenModel> {
        try {
            const queryRunner = this.dataSource.createQueryRunner();

            let user = await this.usersRepository.findOne({ where: { fId: dto.fId } });
            if (!user) {
                await queryRunner.connect();
                await queryRunner.startTransaction();
                try {
                    const userEntity = new User();
                    userEntity.fId = dto.fId;
                    await queryRunner.manager.getRepository(User).save(userEntity);

                    const tokenEntity = new Token();
                    tokenEntity.fId = dto.fId;
                    await queryRunner.manager.getRepository(Token).save(tokenEntity);
                    await queryRunner.commitTransaction();
                } catch (error) {
                    await queryRunner.rollbackTransaction();
                    throw error;
                } finally {
                    await queryRunner.release();
                }
                user = await this.usersRepository.findOne({ where: { fId: dto.fId } });
            }
            const payload = { id: user.id, sub: user.fId };
            const accessToken = this.jwtService.sign(payload, {
                secret: jwtConstants.access_secret,
                expiresIn: jwtConstants.access_expires,
            });
            const refreshToken = this.jwtService.sign(payload, {
                secret: jwtConstants.refresh_secret,
                expiresIn: jwtConstants.refresh_expires,
            });

            await this.tokenRepository.update({ fId: user.fId }, { refreshToken: refreshToken });

            const accessTokenExp = new Date(this.jwtService.decode(accessToken.replace('Bearer ', ''))['exp'] * 1000);
            const refreshTokenExp = new Date(this.jwtService.decode(refreshToken.replace('Bearer ', ''))['exp'] * 1000);

            return {
                accessToken,
                refreshToken,
                accessTokenExp,
                refreshTokenExp,
            };
        } catch (e) {
            this.logger.log(e);
            throw new CommonException(999, 'failed to sign');
        }
    }

    async getNewAccessToken(dto: refeshAccessTokenDto): Promise<AccessTokenModel> {
        try {
            const tokenEntity = new Token();
            const access_token = this.jwtService.decode(dto.accessToken.replace('Bearer ', ''));

            if (!access_token) {
                throw new CommonException(999, 'JWT 오류: 토큰이 비어있습니다');
            }

            tokenEntity.fId = access_token['sub'];

            if (!tokenEntity.fId) {
                throw new CommonException(999, 'JWT 오류: 토큰을 소유한 유저가 존재하지 않습니다');
            }

            const user = await this.usersRepository.findOne({ where: { fId: tokenEntity.fId } });

            const payload = { id: user.id, sub: user.fId };
            const newAccessToken = this.jwtService.sign(payload, {
                secret: jwtConstants.access_secret,
                expiresIn: jwtConstants.access_expires,
            });
            const newAccessTokenExp = new Date(
                this.jwtService.decode(newAccessToken.replace('Bearer ', ''))['exp'] * 1000,
            );

            return {
                accessToken: newAccessToken,
                accessTokenExp: newAccessTokenExp,
            };
        } catch (e) {}
    }
}
