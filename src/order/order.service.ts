import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import Redlock, { Lock } from 'redlock'; // 여기에서 Lock 타입을 가져옴
import { Menu } from 'src/menus/entity/menu.entity';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class OrderService {
    private redlock: Redlock;

    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
        @InjectRedis() private readonly redis: Redis,
    ) {
        this.redlock = new Redlock([redis], {
            driftFactor: 0.01, // 드리프트 요인
            retryCount: 10, // 재시도 횟수
            retryDelay: 200, // 재시도 지연 (밀리초)
            retryJitter: 200, // 재시도 지터 (밀리초)
            automaticExtensionThreshold: 500, // 자동 확장 임계값 (밀리초)
        });
    }

    async checkStockAndLock(order: { orders: { menuId: number; quantity: number }[] }) {
        const insufficientStock = [];
        const locks: Lock[] = [];

        try {
            // Step 1: 모든 메뉴 항목에 대한 잠금 획득
            for (const item of order.orders) {
                const lock = await this.redlock.acquire([`lock:${item.menuId}:id`], 1000);
                locks.push(lock);
            }

            // Step 2: 재고 확인 및 충분한 경우 업데이트
            for (const item of order.orders) {
                const stockKey = `menu:${item.menuId}:id`;
                const stockQuantity = await this.redis.get(stockKey);
                const stockInt = stockQuantity ? parseInt(stockQuantity, 10) : 0;

                if (item.quantity > stockInt) {
                    insufficientStock.push({
                        menuId: item.menuId,
                        requestedQuantity: item.quantity,
                        stockQuantity: stockInt,
                    });
                }
            }

            // Step 3: 메뉴 항목에 재고가 부족한 경우 잠금 해제 및 반품 응답
            if (insufficientStock.length > 0) {
                throw new HttpException('주문 처리 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
                return {
                    success: true,
                    message: '재고가 부족한 메뉴가 있습니다 !',
                    data: insufficientStock,
                };
            }

            // Step 4: Update stock in MySQL and Redis
            for (const item of order.orders) {
                // Update stock in MySQL
                await this.menuRepository.decrement({ id: item.menuId }, 'count', item.quantity);

                // Update stock in Redis
                const stockKey = `menu:${item.menuId}:id`;
                await this.redis.decrby(stockKey, item.quantity);
            }

            return {
                success: true,
                message: '주문이 성공적으로 처리되었습니다.',
            };
        } catch (error) {
            throw new HttpException('주문 처리 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            // Step 5: 획득한 모든 잠금 해제
            for (const lock of locks) {
                try {
                    // Lock 객체의 release() 메서드를 호출하여 락을 해제
                    await lock.release();
                } catch (unlockError) {
                    console.error('Failed to release lock:', unlockError);
                }
            }
        }
    }
}
