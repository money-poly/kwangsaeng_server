import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class SmsException {
    static NOT_FOUND = new CommonException(
        '해당하는 전화번호의 인증 정보가 존재하지 않습니다.',
        6000,
        HttpStatus.NOT_FOUND,
    );

    static INVALID_PHONE_NUMBER = new CommonException('유효하지 않은 전화번호입니다.', 6001, HttpStatus.NOT_FOUND);

    static NO_REMAIN = new CommonException(
        '문자 발송가능 건수가 없습니다. 관리자에게 문의해주세요.',
        6002,
        HttpStatus.BAD_REQUEST,
    );
}
