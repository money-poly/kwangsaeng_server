import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class S3Exception {
    static URL_NOT_FOUND = new CommonException('업로드의 주소가 일치하지 않습니다.', 9000, HttpStatus.NOT_FOUND);

    static NOT_ALLOWED_EXTENSION = new CommonException(
        '파일의 확장자가 지원되지않습니다.',
        9001,
        HttpStatus.BAD_REQUEST,
    );
}
