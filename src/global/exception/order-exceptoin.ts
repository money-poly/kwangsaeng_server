import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class OrderExceotion {
    static FAIL_ORDER_MENU = new CommonException(
        '주문 요청 오류 : 주문 요청 중에 오류가 발생했습니다.',
        3008,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
}
