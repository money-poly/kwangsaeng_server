import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './global/config/validation.schema';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { MenusModule } from './menus/menus.module';
import databaseConfiguration from './global/config/database.configuration';
import { AuthModule } from './auth/auth.module';
import dynamoConfiguration from './global/config/dynamo.configuration';
import { CategoriesModule } from './categories/categories.module';
import { InitializeService } from './initialize.service';
import { SmsModule } from './sms/sms.module';
import { CacheModule } from './cache/cache.module';
import { VersionModule } from './version/version.module';
import { BannersModule } from './banners/banners.module';
import aligoConfiguration from './global/config/aligo.configuration';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TagsModule } from './tags/tags.module';
import { SearchModule } from './search/search.module';
import { SlacktestModule } from './slacktest/slacktest.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfiguration, dynamoConfiguration, aligoConfiguration],
            envFilePath: __dirname + `/../src/global/config/envs/.${process.env.NODE_ENV}.env`,
            validationSchema,
        }),
        ThrottlerModule.forRoot([
            // 전역 Throttl 설정
            {
                ttl: 3000,
                limit: 10,
            },
            {
                ttl: 10000,
                limit: 20,
            },
            {
                ttl: 60000,
                limit: 50,
            },
        ]),
        DatabaseModule,
        UsersModule,
        StoresModule,
        MenusModule,
        AuthModule,
        CategoriesModule,
        SmsModule,
        CacheModule,
        VersionModule,
        BannersModule,
        TagsModule,
        SearchModule,
        SlacktestModule,
    ],
    providers: [Logger, InitializeService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
