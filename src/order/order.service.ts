import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import Redlock, { Lock } from 'redlock';
import { Menu } from 'src/menus/entity/menu.entity';
import { DataSource } from 'typeorm';
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
        const insufficientStock = []; // 수량 부족한 메뉴 데이터
        const locks: Lock[] = []; // 잠금 획득한 데이터
        const redisRollbackData: { key: string; value: number }[] = []; // Redis 롤백 데이터
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            // Step 1: 모든 메뉴 항목에 대한 잠금 획득
            for (const item of order.orders) {
                const lock = await this.redlock.acquire([`lock:${item.menuId}:id`], 1000);
                locks.push(lock);
            }

            // Step 2: 재고 확인 및 충분하지 않은 항목 insufficientStock에 저장
            for (const item of order.orders) {
                const stockKey = `menu:${item.menuId}:id`;
                const stockQuantity = await this.redis.get(stockKey);
                if (stockQuantity === null) {
                    throw OrderExceotion.REDIS_NOT_FOUND;
                }
                const stockInt = parseInt(stockQuantity, 10);
                // if (item.menuId === 3) {      트랜잭션 테스트
                //     throw new Error('인위적으로 발생시킨 예외');
                // }

                if (item.quantity > stockInt) {
                    insufficientStock.push({
                        menuId: item.menuId,
                        requestedQuantity: item.quantity,
                        stockQuantity: stockInt,
                    });
                }
            }

            // Step 3: 메뉴 항목에 재고가 부족한 경우 부족한 재료 메뉴들 응답
            if (insufficientStock.length > 0) {
                return insufficientStock;
            }

            // Step 4: 재고가 충분할 시 MySQL 및 Redis의 재고 업데이트
            for (const item of order.orders) {
                await queryRunner.manager.decrement(Menu, { id: item.menuId }, 'count', item.quantity);

                const stockKey = `menu:${item.menuId}:id`;
                const currentStock = await this.redis.get(stockKey);
                redisRollbackData.push({ key: stockKey, value: parseInt(currentStock, 10) }); // 현재 상태를 저장
                await this.redis.decrby(stockKey, item.quantity);
            }

            await queryRunner.commitTransaction();
            return;
        } catch (e) {
            await queryRunner.rollbackTransaction();

            // Redis 상태 롤백
            for (const item of redisRollbackData) {
                await this.redis.set(item.key, item.value.toString());
            }

            this.logger.error(e);
            if (e instanceof CommonException) {
                throw e;
            }
            throw OrderExceotion.FAIL_ORDER_TRANSACTION;
        } finally {
            // Step 5: 획득한 모든 잠금 해제
            for (const lock of locks) {
                try {
                    await lock.release();
                } catch (unlockError) {
                    this.logger.error(unlockError);
                    throw OrderExceotion.FAIL_UNLOCK_REDIS;
                }
            }
            await queryRunner.release();
        }
    }
}
