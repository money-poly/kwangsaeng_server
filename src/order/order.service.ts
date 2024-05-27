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
        const locks: Lock[] = []; // 잠금 획들한 데이터
        const redisRollbackData: { key: string; value: number }[] = []; // Redis 롤백 데이터

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
            await this.updateStock(order, queryRunner, redisRollbackData);
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
            await this.releaseLocks(locks);
            await queryRunner.release();
        }
    }
    private generateOrderId(): string {
        const digits = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
        const letters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join(
            '',
        );
        return digits + letters;
    }

    // Step 1: 모든 메뉴 항목에 대한 잠금 획득
    private async acquireLocks(order: OrderMenuDto, locks: Lock[]): Promise<void> {
        for (const item of order.orders) {
            const lock = await this.redlock.acquire([`lock:${item.menuId}:id`], 1000);
            locks.push(lock);
        }
    }

    // Step 2: 재고 확인 및 충분하지 않은 항목 insufficientStock에 저장
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
            redisRollbackData.push({ key: stockKey, value: stockInt }); // 현재 상태를 저장
            // if (item.menuId === 3) {
            //     throw new Error('인위적으로 발생시킨 예외'); //  트랜잭션 테스트
            // }

            if (item.quantity > stockInt) {
                // throw new Error('재고 수량이 부족합니다 !!!');  // jmeter 부하테스트  가독성
                insufficientStock.push({
                    menuId: item.menuId,
                    requestedQuantity: item.quantity,
                    stockQuantity: stockInt,
                });
            }
        }

        return insufficientStock;
    }

    // Step 4: 재고가 충분할 시 MySQL 및 Redis의 재고 업데이트
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
    // Step 5: 획득한 모든 잠금 해제
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
