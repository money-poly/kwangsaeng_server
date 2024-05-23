import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { Seller } from './entity/seller.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Seller])],
    controllers: [UsersController],
    providers: [UsersService, Logger, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
