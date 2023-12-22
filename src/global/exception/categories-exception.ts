import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class CategoriesException {
    static ALREADY_EXIST_CATEGORY_NAME = new CommonException(
        '이미 존재하는 카테고리 이름입니다.',
        5000,
        HttpStatus.UNPROCESSABLE_ENTITY,
    );

    static PARENT_NOT_FOUND = new CommonException('존재하지 않는 대분류 카테고리입니다.', 5001, HttpStatus.NOT_FOUND);
}
