import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommonException } from 'src/global/exception/common.exception';
import { uid } from 'rand-token';

import { SellerLoginDto } from './dto/auth.dto';
import { User } from 'src/users/entity/user.entity';
import { Token } from 'src/auth/entity/auth.entity';
import { TokenModel } from './model/auth.model';

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
            const accessToken = this.jwtService.sign(payload);
            const refreshToken = uid(256);

            await this.tokenRepository.update({ id: user.id }, { refreshToken: refreshToken });

            const accessTokenExp = new Date(this.jwtService.decode(accessToken.replace('Bearer ', ''))['exp'] * 1000);

            return {
                accessToken,
                refreshToken,
                accessTokenExp,
            };
        } catch (e) {
            this.logger.log(e);
            throw new CommonException(999, 'failed to sign');
        }
    }

    // async refreshAccessToken(dto: refeshAccessTokenDto) {
    //     try {
    //         const jwtEntity = new JWT();
    //         jwtEntity.refreshToken = dto.refreshToken;

    //         const now = new Date();

    //         const betweenTime = Math.floor((tokenExp.getTime() - now.getTime()) / 1000 / 60);
    //         // 기간 만료된 경우 || 기간 얼마 안남은 경우
    //         if (betweenTime < 3) {
    //             // refreshToken 통신 유도
    //             return {
    //                 id: user.id,
    //                 email: user.email,
    //                 isAuth: true,
    //                 isRefresh: true,
    //             };
    //         }
    //     } catch (e) {}
    // }
}
