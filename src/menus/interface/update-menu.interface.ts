import { MenuStatus } from '../enum/menu-status.enum';

export interface UpdateMenuArgs {
    image?: string;
    name?: string;
    description?: string;
    status?: MenuStatus;
    price?: number;
    sellingPrice?: number;
}
