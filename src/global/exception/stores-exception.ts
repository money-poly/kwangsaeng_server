import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class StoresException {
    static ALREADY_EXIST_STORE_NAME = new CommonException(
        '이미 존재하는 가게 이름입니다.',
        2000,
        HttpStatus.UNPROCESSABLE_ENTITY,
    );

    static HAS_NO_PERMISSION_CREATE = new CommonException('가게 생성 권한이 없습니다.', 2001, HttpStatus.FORBIDDEN);
    static ENTITY_NOT_FOUND = new CommonException('존재하지 않는 가게입니다.', 2002, HttpStatus.NOT_FOUND);
}
