import { MenuStatus } from '../enum/menu-status.enum';

export interface CreateMenuArgs {
    storeId: number;
    menuPictureUrl?: string;
    name: string;
    description?: string;
    status: MenuStatus;
    price: number;
    discountRate: number;
    salePrice: number;
    countryOfOrigin?: { ingredient: string; origin: string }[];
}
