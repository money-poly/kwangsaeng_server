import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configGenerator } from 'src/global/util/database.config.generator';

import { ConfigModule, ConfigType} from '@nestjs/config';
import databaseConfiguration from 'src/global/config/database.configuration';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            // useFactory: () => configGenerator(process.env.NODE_ENV),
		imports: [ConfigModule],
            inject: [databaseConfiguration.KEY],
            useFactory: (config: ConfigType<typeof databaseConfiguration>) => ({
                type: 'mysql',
                host: config.host,
                port: config.port,
                username: config.username,
                password: config.password,
                database: config.database,
                synchronize: config.sync,
                ssl: config.ssl,
                entities: [__dirname + '/../**/*.entity.*'],
            }),
        }),
    ],
})
export class DatabaseModule {}
