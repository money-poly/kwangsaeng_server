import { SetMetadata } from '@nestjs/common';
import { FindOptionsRelations } from 'typeorm';

export const EntityTransformerKey = 'EntityTransformerKey';

export interface EntityTransformerOptions<T> {
    loadEntityOptions?: {
        /**
         * Param -> Entity로 변환시에 함께 불러올 관계 설정 옵션
         * 타입 지원
         */
        relations: FindOptionsRelations<T>;
    };
    response?: {
        // TODO: 동적 타입 지원 어떻게?
        /**
         * 응답시에 제외할 속성의 문자열로 이루어진 배열
         * example: ['id', 'detail.id']
         */
        excludeProperties?: string[];
    };
}

export function EntityTransformer<T>(options: EntityTransformerOptions<T>) {
    return SetMetadata(EntityTransformerKey, options);
}
