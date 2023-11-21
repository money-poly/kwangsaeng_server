import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';
import { User } from 'src/users/entity/user.entity';
import { jwtConstants } from 'src/global/config/jwtconstant';
import { TokensRepository } from './auth.repository';
import { UsersRepository } from 'src/users/users.repository';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.ACCESS_SECRET,
        }),
        TypeOrmModule.forFeature([Token, User]),
    ],
    controllers: [AuthController],
    providers: [AuthService, Logger, TokensRepository, UsersRepository],
})
export class AuthModule {}
