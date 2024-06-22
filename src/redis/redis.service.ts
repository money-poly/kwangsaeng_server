// src/redis/redis.service.ts
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisService {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async get(key: string): Promise<string> {
        return this.redis.get(key);
    }

    async set(key: string, value: string): Promise<void> {
        await this.redis.set(key, value);
    }

    async decrby(key: string, decrement: number): Promise<void> {
        await this.redis.decrby(key, decrement);
    }
}
