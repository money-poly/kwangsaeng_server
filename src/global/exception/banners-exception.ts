import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class BannerException {
    static ALREADY_EXIST_BANNER = new CommonException(
        '이미 존재하는 배너입니다.',
        10000,
        HttpStatus.UNPROCESSABLE_ENTITY,
    );
}
