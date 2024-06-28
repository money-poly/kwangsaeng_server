import { Injectable } from '@nestjs/common';
import Redlock, { Lock } from 'redlock';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedlockService {
    private redlock: Redlock;

    constructor(@InjectRedis() private readonly redis: Redis) {
        this.redlock = new Redlock([redis], {
            retryCount: 10,
            retryDelay: 200,
        });
    }

    async acquireLocks(resources: string[], ttl: number): Promise<Lock[]> {
        const locks: Lock[] = [];
        for (const resource of resources) {
            const lock = await this.redlock.acquire([resource], ttl);
            locks.push(lock);
        }
        return locks;
    }

    async releaseLocks(locks: Lock[]): Promise<void> {
        for (const lock of locks) {
            try {
                await lock.release();
            } catch (unlockError) {
                throw new Error('Failed to release lock');
            }
        }
    }
}
