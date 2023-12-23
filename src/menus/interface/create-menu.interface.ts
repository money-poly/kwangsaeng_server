import { MenuStatus } from '../enum/menu-status.enum';

export interface CreateMenuArgs {
    storeId: number;
    image?: string;
    name: string;
    description: string;
    status: MenuStatus;
    price: number;
    discountRate: number;
    salePrice: number;
}
