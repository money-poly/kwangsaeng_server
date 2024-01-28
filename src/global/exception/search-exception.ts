import { HttpStatus } from '@nestjs/common';
import { CommonException } from './common-exception';

export abstract class SearchException {
    static RECOMMAND_KEYWORD_NOT_FOUND = new CommonException(
        '존재하지 않는 추천 검색어입니다.',
        11000,
        HttpStatus.NOT_FOUND,
    );
    static FAIL_SAVE_RECOMMAND_KEYWORD = new CommonException(
        '추천 검색어 저장에 실패했습니다.',
        11001,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
    static UNDEFINED_TO_KEYWORD = new CommonException(
        '데이터가 정의되지 않았습니다',
        11002,
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
}
