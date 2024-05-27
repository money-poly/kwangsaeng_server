import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import Redlock, { Lock } from 'redlock';
import { Menu } from 'src/menus/entity/menu.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { OrderMenuDto } from './dto/order-menu.dto';

import { OrderExceotion } from 'src/global/exception/order-exceptoin';
import { CommonException } from 'src/global/exception/common-exception';

@Injectable()
export class OrderService {
    private redlock: Redlock;
    private readonly logger = new Logger(OrderService.name);

    constructor(
        private readonly dataSource: DataSource,
        @InjectRedis() private readonly redis: Redis,
    ) {
        this.redlock = new Redlock([redis], {
            retryCount: 10, // 재시도 횟수
            retryDelay: 200, // 재시도 지연 (밀리초)
        });
    }

    async checkStockAndLock(order: OrderMenuDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        const locks: Lock[] = [];
        const redisRollbackData: { key: string; value: number }[] = [];

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            await this.acquireLocks(order, locks);
            const insufficientStock = await this.checkStock(order, redisRollbackData);

            if (insufficientStock.length > 0) {
                return insufficientStock;
            }

            await this.updateStock(order, queryRunner, redisRollbackData);
            await queryRunner.commitTransaction();
            return;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            await this.rollbackRedis(redisRollbackData);

            this.logger.error(e);
            if (e instanceof CommonException) {
                throw e;
            }
            throw OrderExceotion.FAIL_ORDER_TRANSACTION;
        } finally {
            await this.releaseLocks(locks);
            await queryRunner.release();
        }
    }

    private async acquireLocks(order: OrderMenuDto, locks: Lock[]): Promise<void> {
        for (const item of order.orders) {
            const lock = await this.redlock.acquire([`lock:${item.menuId}:id`], 1000);
            locks.push(lock);
        }
    }

    private async checkStock(
        order: OrderMenuDto,
        redisRollbackData: { key: string; value: number }[],
    ): Promise<{ menuId: number; requestedQuantity: number; stockQuantity: number }[]> {
        const insufficientStock = [];

        for (const item of order.orders) {
            const stockKey = `menu:${item.menuId}:id`;
            const stockQuantity = await this.redis.get(stockKey);
            if (stockQuantity === null) {
                throw OrderExceotion.REDIS_NOT_FOUND;
            }
            const stockInt = parseInt(stockQuantity, 10);
            redisRollbackData.push({ key: stockKey, value: stockInt });

            if (item.quantity > stockInt) {
                insufficientStock.push({
                    menuId: item.menuId,
                    requestedQuantity: item.quantity,
                    stockQuantity: stockInt,
                });
            }
        }

        return insufficientStock;
    }

    private async updateStock(
        order: OrderMenuDto,
        queryRunner: QueryRunner,
        redisRollbackData: { key: string; value: number }[],
    ): Promise<void> {
        for (const item of order.orders) {
            await queryRunner.manager.decrement(Menu, { id: item.menuId }, 'count', item.quantity);

            const stockKey = `menu:${item.menuId}:id`;
            const currentStock = await this.redis.get(stockKey);
            redisRollbackData.push({ key: stockKey, value: parseInt(currentStock, 10) });
            await this.redis.decrby(stockKey, item.quantity);
        }
    }

    private async rollbackRedis(redisRollbackData: { key: string; value: number }[]): Promise<void> {
        for (const item of redisRollbackData) {
            await this.redis.set(item.key, item.value.toString());
        }
    }

    private async releaseLocks(locks: Lock[]): Promise<void> {
        for (const lock of locks) {
            try {
                await lock.release();
            } catch (unlockError) {
                this.logger.error(unlockError);
                throw OrderExceotion.FAIL_UNLOCK_REDIS;
            }
        }
    }
}
