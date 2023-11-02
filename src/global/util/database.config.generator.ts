import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const configGenerator = (env: string): TypeOrmModuleOptions => {
    if (env === 'dev')
        return {
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: true,
            entities: [__dirname + '/../../**/*.entity.*'],
            logging: true,
        };
    else if (env === 'prod')
        return {
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: JSON.parse(process.env.DATABASE_SYNC),
            entities: [__dirname + '/../**/*.entity.*'],
        };
};
