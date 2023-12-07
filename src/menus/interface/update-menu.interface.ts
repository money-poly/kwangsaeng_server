import { MenuStatus } from '../enum/menu-status.enum';

export interface UpdateMenuArgs {
    menuPictureUrl?: string;
    name?: string;
    description?: string;
    status?: MenuStatus;
    price?: number;
    discountRate?: number;
}
