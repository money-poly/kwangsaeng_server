import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class VersionException {
    static ALREADY_EXIST_PLATFORM = new CommonException(
        '이미 존재하는 플랫폼 버전입니다.',
        7000,
        HttpStatus.UNPROCESSABLE_ENTITY,
    );
}
