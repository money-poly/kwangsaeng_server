import { Module } from '@nestjs/common';
import { Stores2Service } from './stores2.service';
import { Stores2Controller } from './stores2.controller';
import { Stores2Appender } from './implement/stores2.appender';
import { Stores2Manager } from './implement/stores2.manager';
import { Stores2Reader } from './implement/stores2.reader';
import { Stores2Repository } from './stores2.repository';
import { Menus2Reader } from 'src/menus2.0/implement/menus2.reader';
import { TagsModule } from 'src/tags/tags.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerS3Config } from 'src/global/config/multer-s3.config';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/stores/entity/store.entity';
import { Seller } from 'src/users/entity/seller.entity';
import { StoreDetail } from 'src/stores/entity/store-detail.entity';
import { StoreApprove } from 'src/stores/entity/store-approve.entity';
import { BusinessDetail } from 'src/stores/entity/business-detail.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Store, Seller, StoreDetail, BusinessDetail, StoreApprove]),
        // 초기단계에서는 스토어와 메뉴를 제외한 다른 모듈은 모듈 자체를 imports
        // TODO) 아래의 모듈 마저도 implement layer를 통해 의존성 주입
        CategoriesModule,
        UsersModule,
        HttpModule,
        TagsModule,
        MulterModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => multerS3Config(configService),
        }),
    ],
    providers: [Stores2Service, Stores2Appender, Stores2Manager, Stores2Reader, Stores2Repository, Menus2Reader],
    controllers: [Stores2Controller],
})
export class Stores2Module {}
