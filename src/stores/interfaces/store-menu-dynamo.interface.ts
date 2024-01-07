export interface DynamoKey {
    storeName: string; // hashKey(파티션 키)
    menuId: number; // sortKey(정렬 키)
}

export interface DynamoSchema extends DynamoKey {
    menuName: string;
    menuPictureUrl: string;
    discountRate: number;
    sellingPrice: number;
    viewCount: number;
}
