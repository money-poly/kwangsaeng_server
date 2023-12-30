import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class SmsException {
    static NOT_FOUND = new CommonException(
        '해당하는 전화번호의 인증 정보가 존재하지 않습니다.',
        2000,
        HttpStatus.NOT_FOUND,
    );

    static INVALID_PHONE_NUMBER = new CommonException('유효하지 않은 전화번호입니다.', 2000, HttpStatus.NOT_FOUND);
}
