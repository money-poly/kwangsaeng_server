import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common.exception';

export abstract class StoresException {
    static ALREADY_EXIST_STORE_NAME = new CommonException(
        2000,
        '이미 존재하는 가게 이름입니다.',
        HttpStatus.UNPROCESSABLE_ENTITY,
    );

    static HAS_NO_PERMISSION_CREATE = new CommonException(2001, '가게 생성 권한이 없습니다.', HttpStatus.FORBIDDEN);
}
