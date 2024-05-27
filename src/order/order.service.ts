import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import Redlock, { Lock } from 'redlock';
import { Menu } from 'src/menus/entity/menu.entity';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { OrderMenuDto } from './dto/order-menu.dto';

import { OrderExceotion } from 'src/global/exception/order-exceptoin';
import { CommonException } from 'src/global/exception/common-exception';

@Injectable()
export class OrderService {
    private redlock: Redlock;
    private readonly logger = new Logger(OrderService.name);

    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
        @InjectRedis() private readonly redis: Redis,
    ) {
        this.redlock = new Redlock([redis], {
            retryCount: 10, // 재시도 횟수
            retryDelay: 200, // 재시도 지연 (밀리초)
        });
    }

    async checkStockAndLock(order: OrderMenuDto) {
        const insufficientStock = []; //수량 부족한 메뉴 데이터
        const locks: Lock[] = []; // 잠금 획들한 데이터

        try {
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
                await this.menuRepository.decrement({ id: item.menuId }, 'count', item.quantity);

                const stockKey = `menu:${item.menuId}:id`;
                await this.redis.decrby(stockKey, item.quantity);
            }

            return;
        } catch (e) {
            this.logger.error(e);
            if (e instanceof CommonException) {
                throw e; // CommonException 타입의 예외는 그대로 던집니다.
            }
            throw OrderExceotion.FAIL_ORDER_MENU;
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
        }
    }
}
