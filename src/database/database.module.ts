import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamooseModule } from 'nestjs-dynamoose';
import { configGenerator } from 'src/global/util/database.config.generator';
import { ConfigModule, ConfigType } from '@nestjs/config';
import dynamoConfiguration from 'src/global/config/dynamo.configuration';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => configGenerator(process.env.NODE_ENV),
        }),
        DynamooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [dynamoConfiguration.KEY],
            useFactory: (config: ConfigType<typeof dynamoConfiguration>) => ({
                aws: {
                    accessKeyId: config.dynamoAccessKey,
                    secretAccessKey: config.dynamoSecretKey,
                    region: config.region,
                },
            }),
        }),
    ],
})
export class DatabaseModule {}
