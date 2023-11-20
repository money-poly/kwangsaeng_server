import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entity/store.entity';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Store, User])],
    controllers: [StoresController],
    providers: [StoresService, StoresRepository, UsersRepository],
    exports: [StoresService],
})
export class StoresModule {}
