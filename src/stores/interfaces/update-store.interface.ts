import { OperationTimes } from '../dto/create-store.dto';

export interface UpdateStoreArgs {
    name?: string; // 가게 이름
    address?: string; // 가게 주소
    addressDetail?: string; // 가게 상세 주소
    operationTimes?: OperationTimes; // 영업시간(startedAt, endedAt)
    cookingTime?: number; // 평균 조리 시간
    storePictureUrl?: string; // 가게 이미지
    phone?: string; // 가게 전화번호
    description?: string; // 가게 설명

    tagId?: number; // 가게 태그 id
    categories?: number[]; // 가게 카테고리 id
}
