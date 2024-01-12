import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class TagException {
    static NOT_FOUND = new CommonException('존재하지 않는 태그입니다.', 8000, HttpStatus.NOT_FOUND);
    static ALREADY_EXIST_TAG = new CommonException(
        '동일한 이름의 태그가 이미 존재합니다.',
        8001,
        HttpStatus.UNPROCESSABLE_ENTITY,
    );
}
