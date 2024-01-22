import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class MenusException {
    static ALREADY_EXIST_MENU_NAME = new CommonException(
        '이미 존재하는 메뉴 이름입니다.',
        3000,
        HttpStatus.UNPROCESSABLE_ENTITY,
    );
    static HAS_NO_PERMISSION_CREATE = new CommonException('메뉴 생성 권한이 없습니다.', 3001, HttpStatus.FORBIDDEN);
    static ENTITY_NOT_FOUND = new CommonException('존재하지 않는 메뉴입니다.', 3002, HttpStatus.NOT_FOUND);
    static STATUS_NOT_FOUND = new CommonException('식별되지않은 메뉴 상태입니다.', 3003, HttpStatus.NOT_FOUND);
    static FILTER_TYPE_NOT_FOUND = new CommonException('식별되지않은 필터링 타입입니다.', 3004, HttpStatus.NOT_FOUND);
    static HAS_NO_PERMISSION_DELETE = new CommonException('메뉴 삭제 권한이 없습니다.', 3005, HttpStatus.FORBIDDEN);
}
