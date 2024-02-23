import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class StoresException {
    static ALREADY_EXIST_STORE_NAME = new CommonException(
        '이미 존재하는 가게 이름입니다.',
        2000,
        HttpStatus.UNPROCESSABLE_ENTITY,
    );

    static HAS_NO_PERMISSION_CREATE = new CommonException('가게 생성 권한이 없습니다.', 2001, HttpStatus.FORBIDDEN);

    static ENTITY_NOT_FOUND = new CommonException('찾을 수 없는 가게입니다.', 2002, HttpStatus.NOT_FOUND);

    static ALREADY_HAS_STORE = new CommonException(
        '이미 가게를 소유하고 있습니다.',
        2003,
        HttpStatus.UNPROCESSABLE_ENTITY,
    );

    static ALREADY_APPROVED = new CommonException(
        '이미 운영 승인된 가게입니다.',
        2004,
        HttpStatus.UNPROCESSABLE_ENTITY,
    );

    static HAS_NO_PERMISSIONS = new CommonException('권한이 없습니다.', 2005, HttpStatus.FORBIDDEN);

    static NOT_APPROVED = new CommonException('운영 승인되지 않은 가게입니다.', 2006, HttpStatus.FORBIDDEN);

    static INVALID_ADDRESS = new CommonException('유효하지 않은 도로명 주소입니다.', 2007, HttpStatus.BAD_REQUEST);

    static ORDER_NOT_FOUND = new CommonException('메뉴의 순서를 찾을 수 없습니다.', 2008, HttpStatus.NOT_FOUND);
}
