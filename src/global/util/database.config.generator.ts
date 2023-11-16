import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const configGenerator = (env: string): TypeOrmModuleOptions => {
    if (env === 'local')
        return {
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: JSON.parse(process.env.DATABASE_SYNC),
            entities: [__dirname + '/../../**/*.entity.*'],
            logging: true,
            namingStrategy: new SnakeNamingStrategy(),
        };
    else if (env === 'dev')
        return {
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: JSON.parse(process.env.DATABASE_SYNC),
            ssl: {
                rejectUnauthorized: true,
            },
            entities: [__dirname + '/../../**/*.entity.*'],
            namingStrategy: new SnakeNamingStrategy(),
        };
};
