export interface DynamoKey {
    menuId: number; // hashKey(파티션 키)
    storeName: string; // sortKey(정렬 키)
}

export interface DynamoSchema extends DynamoKey {
    storeId: number;
    menuName: string;
    menuPictureUrl: string;
    discountRate: number;
    sellingPrice: number;
    viewCount: number;
}
