import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { Menu } from './entity/menu.entity';
import { Store } from 'src/stores/entity/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresService } from 'src/stores/stores.service';
import { StoresRepository } from 'src/stores/stores.repository';
import { MenusRepository } from './menus.repository';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entity/user.entity';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamoSchema } from 'src/stores/dynamo.schema';

@Module({
    imports: [
        TypeOrmModule.forFeature([Menu, Store, User]),
        DynamooseModule.forFeature([{ name: 'Store-Menu', schema: DynamoSchema }]),
    ],
    controllers: [MenusController],
    providers: [MenusService, MenusRepository, StoresRepository, UsersRepository],
    exports: [MenusService],
})
export class MenusModule {}
//
