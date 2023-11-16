import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class AuthException {
    static IS_EMPTY_TOKEN = new CommonException('JWT 검증 오류: 비어있는 Token 입니다.', 1000, HttpStatus.UNAUTHORIZED);

    static NOT_VALID_TOKEN = new CommonException(
        'JWT 검증 오류: 유효하지 않은 토큰입니다.',
        1001,
        HttpStatus.UNAUTHORIZED,
    );

    static IS_EXPIRED_TOKEN = new CommonException(
        'JWT 검증 오류: 토큰이 만료되었습니다.',
        1002,
        HttpStatus.UNAUTHORIZED,
    );

    static NOT_BEFORE_TOKEN = new CommonException(
        'JWT 검증 오류: 아직 활성화되지 않은 토큰입니다.',
        1003,
        HttpStatus.UNAUTHORIZED,
    );

    static DEFAULT_TOKEN_ERROR = new CommonException(
        'JWT 검증 오류: 검증 중에 오류가 발생했습니다.',
        1004,
        HttpStatus.UNAUTHORIZED,
    );

    static FAIL_UPDATE_TOKEN = new CommonException(
        'Token 갱신에 실패했습니다.',
        1005,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );

    static FAIL_EXTRACT_TOKEN_EXPRIED_TIME = new CommonException(
        'Token 만료기한 추출에 실패했습니다.',
        1006,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
}
