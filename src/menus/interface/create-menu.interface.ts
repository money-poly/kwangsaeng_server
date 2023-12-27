import { MenuStatus } from '../enum/menu-status.enum';

export interface CreateMenuArgs {
    storeId: number;
    image?: string;
    name: string;
    description: string;
    status: MenuStatus;
    price: number;
    countryOfOrigin?: { ingredient: string; origin: string }[];
    discountRate: number;
    salePrice: number;
}
