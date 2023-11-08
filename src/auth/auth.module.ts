import { Logger, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { jwtConstants } from './config/secretkey';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entity/auth.entity';
import { User } from 'src/users/entity/user.entity';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '30m' },
        }),
        TypeOrmModule.forFeature([Token, User]),
    ],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        Logger,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
