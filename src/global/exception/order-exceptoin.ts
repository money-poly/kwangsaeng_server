import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class OrderExceotion {
    static FAIL_ORDER_MENU = new CommonException(
        '주문 요청 오류 : 주문 요청 중에 오류가 발생했습니다.',
        12001,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
    static FAIL_UNLOCK_REDIS = new CommonException(
        '레디스 오류 : LOCK 해제에 실패했습니다.',
        12002,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
    static REDIS_NOT_FOUND = new CommonException(
        '레디스 오류 : 레디스에 존재하지 않는 메뉴입니다.',
        12003,
        HttpStatus.NOT_FOUND,
    );
}
