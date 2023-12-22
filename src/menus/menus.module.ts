import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { Menu } from './entity/menu.entity';
import { Store } from 'src/stores/entity/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresRepository } from 'src/stores/stores.repository';
import { MenusRepository } from './menus.repository';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entity/user.entity';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamoSchema } from 'src/stores/dynamo.schema';
import { MenuView } from './entity/menu-view.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Menu, Store, User, MenuView, StoreDetail, BusinessDetail, StoreApprove]),
        DynamooseModule.forFeature([{ name: 'Store-Menu', schema: DynamoSchema }]),
        CategoriesModule,
    ],
    controllers: [MenusController],
    providers: [MenusService, MenusRepository, StoresRepository, UsersRepository],
    exports: [MenusService],
})
export class MenusModule {}
