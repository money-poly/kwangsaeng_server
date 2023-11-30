export interface DynamoKey {
    store_id: number; // hashKey(파티션 키)
    menu_id: number; // sortKey(정렬 키)
}

export interface DynamoSchema extends DynamoKey {
    menu_name: string;
    menu_image: string;
    menu_saleRate: number;
    menu_price: number;
}
