import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: process.env.DATABASE_TYPE.toString(),
    host: process.env.DATABASE_HOST.toString(),
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME.toString(),
    password: process.env.DATABASE_PASSWORD.toString(),
    database: process.env.DATABASE_NAME.toString(),
    sync: JSON.parse(process.env.DATABASE_SYNC),
    ssl: Object({
        rejectUnauthorized: true,
    }),
}));
