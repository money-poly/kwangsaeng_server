import { Logger, Module, forwardRef } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { Menu } from './entity/menu.entity';
import { Store } from 'src/stores/entity/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresRepository } from 'src/stores/stores.repository';
import { MenusRepository } from './menus.repository';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entity/user.entity';
import { MenuView } from './entity/menu-view.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { StoresModule } from 'src/stores/stores.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerS3Config } from 'src/global/config/multer-s3.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([Menu, Store, User, MenuView, StoreDetail, BusinessDetail, StoreApprove]),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => multerS3Config(configService),
        }),
        CategoriesModule,
        forwardRef(() => StoresModule), // 순환참조 해결
    ],
    controllers: [MenusController],
    providers: [MenusService, MenusRepository, StoresRepository, UsersRepository, Logger],
    exports: [MenusService],
})
export class MenusModule {}
