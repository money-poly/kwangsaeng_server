import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class DynamoException {
    static ITEM_NOT_FOUND = new CommonException('항목을 찾을 수 없습니다.', 4000, HttpStatus.NOT_FOUND);

    static CONDITION_CHECK_FAILED = new CommonException('조건 확인에 실패했습니다.', 4001, HttpStatus.BAD_REQUEST);

    static PROVISIONED_THROUGHPUT_EXCEEDED = new CommonException(
        '프로비저닝된 처리량 초과.',
        4002,
        HttpStatus.TOO_MANY_REQUESTS,
    );

    static ITEM_COLLECTION_SIZE_LIMIT_EXCEEDED = new CommonException(
        '항목 컬렉션 크기 제한 초과.',
        4003,
        HttpStatus.BAD_REQUEST,
    );

    static RESOURCE_NOT_FOUND = new CommonException(
        '요청한 테이블 또는 인덱스를 찾을 수 없습니다.',
        4004,
        HttpStatus.NOT_FOUND,
    );

    static Limit_Exceeded = new CommonException('동시 제어 작업이 너무 많습니다.', 4005, HttpStatus.TOO_MANY_REQUESTS);

    static Request_Limit_Exceeded = new CommonException(
        '처리량이 너무 많아서 한도를 초과했습니다.',
        4006,
        HttpStatus.TOO_MANY_REQUESTS,
    );
    static VALIDATION_ERROR = new CommonException('DynamoDB 요청 유효성 검사 실패.', 4007, HttpStatus.BAD_REQUEST);

    static TRANSACTION_CONFLICT = new CommonException('DynamoDB 트랜잭션 충돌.', 4008, HttpStatus.CONFLICT);

    static INTERNAL_SERVER_ERROR = new CommonException(
        'DynamoDB 내부 서버 오류.',
        4009,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
}
