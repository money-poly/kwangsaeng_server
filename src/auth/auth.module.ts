import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';
import { TokensRepository } from './auth.repository';
import { UsersRepository } from 'src/users/users.repository';
import { SmsModule } from 'src/sms/sms.module';
import { Seller } from 'src/users/entity/seller.entity';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_ACCESS_SECRET,
        }),
        TypeOrmModule.forFeature([Token, Seller]),
        SmsModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, Logger, TokensRepository, UsersRepository],
})
export class AuthModule {}
