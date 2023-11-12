import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configGenerator } from 'src/global/util/database.config.generator';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => configGenerator(process.env.NODE_ENV),
        }),
    ],
})
export class DatabaseModule {}
