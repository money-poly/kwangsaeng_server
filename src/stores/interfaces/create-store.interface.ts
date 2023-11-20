import { StoreCategory } from '../enum/store-category.enum';

export interface CreateStoreArgs {
    name: string;
    category: StoreCategory;
    address: string;
    latitude: number;
    longitude: number;
}
