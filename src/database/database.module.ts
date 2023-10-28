import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfiguration from 'src/global/config/database.configuration';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
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
