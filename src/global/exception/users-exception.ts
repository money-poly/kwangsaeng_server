import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class UsersException {
    static FAIL_SAVE_USER = new CommonException(
        '유저 정보 저장에 실패했습니다.',
        1100,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );

    static NOT_EXIST_USER = new CommonException('유저가 존재하지 않습니다.', 1101, HttpStatus.UNPROCESSABLE_ENTITY);
}
