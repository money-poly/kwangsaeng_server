import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './global/config/validation.schema';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { MenusModule } from './menus/menus.module';
import databaseConfiguration from './global/config/database.configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfiguration],
            envFilePath: __dirname + `/../src/global/config/envs/.${process.env.NODE_ENV}.env`,
            validationSchema,
        }),
        DatabaseModule,
        UsersModule,
        StoresModule,
        MenusModule,
    ],
    controllers: [AppController],
    providers: [AppService, Logger],
})
export class AppModule {}
