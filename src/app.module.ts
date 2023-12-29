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
import twilioConfiguration from './global/config/twilio.configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfiguration, dynamoConfiguration, twilioConfiguration],
            envFilePath: __dirname + `/../src/global/config/envs/.${process.env.NODE_ENV}.env`,
            validationSchema,
        }),
        DatabaseModule,
        UsersModule,
        StoresModule,
        MenusModule,
        AuthModule,
        CategoriesModule,
        SmsModule,
    ],
    providers: [Logger, InitializeService],
})
export class AppModule {}
