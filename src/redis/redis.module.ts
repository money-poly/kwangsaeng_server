// src/redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { RedisModule as RedisModuleOriginal } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';
import { RedlockService } from './redlock.service';

@Module({
    imports: [
        RedisModuleOriginal.forRootAsync({
            useFactory: () => ({
                type: 'single',
                url: process.env.REDIS_HOST,
                tls: {
                    rejectUnauthorized: false,
                },
            }),
        }),
    ],
    providers: [RedisService, RedlockService],
    exports: [RedisService, RedlockService],
})
export class RedisModule {}
