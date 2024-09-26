import { Logger, Module, forwardRef } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { Menu } from './entity/menu.entity';
import { Store } from 'src/stores/entity/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresRepository } from 'src/stores/stores.repository';
import { MenusRepository } from './menus.repository';
import { UsersRepository } from 'src/users/users.repository';
import { MenuView } from './entity/menu-view.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { StoresModule } from 'src/stores/stores.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerS3Config } from 'src/global/config/multer-s3.config';
import { Seller } from 'src/users/entity/seller.entity';
import { Menus2Service } from 'src/menus2.0/menus2.service';
import { Menus2Appender } from 'src/menus2.0/implement/menus2.appender';
import { Menus2Reader } from 'src/menus2.0/implement/menus2.reader';
import { Menus2Validator } from 'src/menus2.0/implement/menus2.validator';
import { Menus2Manager } from 'src/menus2.0/implement/menus2.manager';
import { Stores2Appender } from 'src/stores2.0/implement/stores2.appender';
import { Stores2Manager } from 'src/stores2.0/implement/stores2.manager';
import { Stores2Reader } from 'src/stores2.0/implement/stores2.reader';
import { Stores2Validator } from 'src/stores2.0/implement/stores2.validator';
import { OrdersReader } from 'src/orders/implement/orders.reader';
import { Menus2Repository } from 'src/menus2.0/menus2.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Menu, Store, Seller, MenuView, StoreDetail, BusinessDetail, StoreApprove]),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => multerS3Config(configService),
        }),
        CategoriesModule,
        forwardRef(() => StoresModule), // 순환참조 해결
    ],
    controllers: [MenusController],
    providers: [
        MenusService,
        MenusRepository,
        StoresRepository,
        UsersRepository,
        Logger,

        // Menus 2.0
        // Service
        Menus2Service,

        // Implement
        Menus2Appender,
        Menus2Reader,
        Menus2Manager,
        Menus2Validator,
        Stores2Appender,
        Stores2Manager,
        Stores2Reader,
        Stores2Validator,
        OrdersReader,

        // Repository
        Menus2Repository,
    ],
    exports: [MenusService, Menus2Appender, Menus2Reader, Menus2Manager, Menus2Validator, Menus2Repository],
})
export class MenusModule {}
