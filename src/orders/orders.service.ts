// src/orders/orders.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Menu } from 'src/menus/entity/menu.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { Lock } from 'redlock';
import { OrderMenuDto } from './dto/order-menu.dto';
import { OrderExceotion } from 'src/global/exception/order-exceptoin';
import { CommonException } from 'src/global/exception/common-exception';
import { RedisService } from 'src/redis/redis.service';
import { RedlockService } from 'src/redis/redlock.service';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        private readonly dataSource: DataSource,
        private readonly redisService: RedisService,
        private readonly redlockService: RedlockService,
    ) {}

    async checkStockAndLock(order: OrderMenuDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        const locks: Lock[] = [];
        const redisRollbackData: { key: string; value: number }[] = [];

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            // Step 1: 모든 메뉴 항목에 대한 잠금 획득
            await this.acquireLocks(order, locks);
            // Step 2: 재고 확인 및 충분하지 않은 항목 insufficientStock에 저장
            const insufficientStock = await this.checkStock(order, redisRollbackData);

            // Step 3: 메뉴 항목에 재고가 부족한 경우 부족한 재료 메뉴들 응답
            if (insufficientStock.length > 0) {
                return insufficientStock;
            }
            // Step 4: 재고가 충분할 시 MySQL 및 Redis의 재고 업데이트
            await this.updateStock(order, queryRunner);
            await queryRunner.commitTransaction();
            return { orderId: this.generateOrderId() };
        } catch (e) {
            await queryRunner.rollbackTransaction();
            await this.rollbackRedis(redisRollbackData); // Redis 상태 롤백
            this.logger.error(e);
            if (e instanceof CommonException) {
                throw e;
            }
            throw OrderExceotion.FAIL_ORDER_TRANSACTION;
        } finally {
            // Step 5: 획득한 모든 잠금 해제
            await this.redlockService.releaseLocks(locks);
            await queryRunner.release();
        }
    }

    async getStock(menuId: number): Promise<Number> {
        const stockKey = `menu:${menuId}:id`;
        const stockQuantity = await this.redisService.get(stockKey);
        if (stockQuantity === null) {
            throw OrderExceotion.REDIS_NOT_FOUND;
        }
        return Number(stockQuantity);
    }

    private generateOrderId(): string {
        const digits = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
        const letters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join(
            '',
        );
        return digits + letters;
    }

    private async acquireLocks(order: OrderMenuDto, locks: Lock[]): Promise<void> {
        const resources = order.orders.map((item) => `lock:${item.menuId}:id`);
        const acquiredLocks = await this.redlockService.acquireLocks(resources, 1000);
        console.log(acquiredLocks);
        locks.push(...acquiredLocks);
    }

    private async checkStock(
        order: OrderMenuDto,
        redisRollbackData: { key: string; value: number }[],
    ): Promise<{ menuId: number; requestedQuantity: number; stockQuantity: number }[]> {
        const insufficientStock = [];

        for (const item of order.orders) {
            const stockKey = `menu:${item.menuId}:id`;
            const stockQuantity = await this.redisService.get(stockKey);
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

    private async updateStock(order: OrderMenuDto, queryRunner: QueryRunner): Promise<void> {
        for (const item of order.orders) {
            await queryRunner.manager.decrement(Menu, { id: item.menuId }, 'count', item.quantity);
            const stockKey = `menu:${item.menuId}:id`;
            await this.redisService.decrby(stockKey, item.quantity);
        }
    }

    private async rollbackRedis(redisRollbackData: { key: string; value: number }[]): Promise<void> {
        for (const item of redisRollbackData) {
            await this.redisService.set(item.key, item.value.toString());
        }
    }
}
