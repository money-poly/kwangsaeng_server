import { CountryOfOrigin } from '../dto/create-menu.dto';

export interface UpdateMenuArgs {
    menuPictureUrl?: string;
    name?: string;
    description?: string;
    price?: number;
    discountRate?: number;
    sellingPrice?: number;
    expiredDate?: string;
    countryOfOrigin?: CountryOfOrigin[];
}
