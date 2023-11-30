import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamooseModule } from 'nestjs-dynamoose';
import { configGenerator } from 'src/global/util/database.config.generator';
import { DynamooseConfigService } from 'src/database/dynamoose-config.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => configGenerator(process.env.NODE_ENV),
        }),
        DynamooseModule.forRootAsync({ useClass: DynamooseConfigService }),
    ],
})
export class DatabaseModule {}
