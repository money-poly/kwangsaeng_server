import { forwardRef, Module } from '@nestjs/common';
import { Menus2Service } from './menus2.service';
import { Menus2Controller } from './menus2.controller';
import { Menus2Appender } from './implement/menus2.appender';
import { Menus2Reader } from './implement/menus2.reader';
import { Menus2Manager } from './implement/menus2.manager';
import { Menus2Repository } from './menus2.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerS3Config } from 'src/global/config/multer-s3.config';
import { CategoriesModule } from 'src/categories/categories.module';
import { Menu } from 'src/menus/entity/menu.entity';
import { Store } from 'src/stores/entity/store.entity';
import { Seller } from 'src/users/entity/seller.entity';
import { MenuView } from 'src/menus/entity/menu-view.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { Stores2Reader } from 'src/stores2.0/implement/stores2.reader';
import { Stores2Module } from 'src/stores2.0/stores2.module';
import { Stores2Appender } from 'src/stores2.0/implement/stores2.appender';
import { Stores2Manager } from 'src/stores2.0/implement/stores2.manager';
import { OrdersReader } from 'src/orders/implement/orders.reader';
import { OrdersModule } from 'src/orders/orders.module';
import { Stores2Validator } from 'src/stores2.0/implement/stores2.validator';
import { Menus2Validator } from './implement/menus2.validator';

@Module({
    imports: [
        TypeOrmModule.forFeature([Menu, Store, Seller, MenuView, StoreDetail, BusinessDetail, StoreApprove]),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => multerS3Config(configService),
        }),
        // Store의 Implement Layer를 사용하기 위해서는 Store Module DI해야함.
        forwardRef(() => Stores2Module),
        OrdersModule,
        CategoriesModule,
    ],
    providers: [
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
    controllers: [Menus2Controller],
    exports: [Menus2Appender, Menus2Reader, Menus2Manager, Menus2Repository],
})
export class Menus2Module {}
