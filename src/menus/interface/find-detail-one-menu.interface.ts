import { FindSimpleOneMenu } from './find-simple-one-menu.interface';

export interface FindDetailOneMenu {
    id: number;
    menuPictureUrl: string;
    description: string;
    name: string;
    discountRate: number;
    price: number;
    sellingPrice: number;
    count: number;
    expiredDate?: Date;
    countryOfOrigin: {
        ingredient: string;
        origin: string;
    }[];
    store: {
        id: number;
        name: string;
        detail: {
            address: string;
            addressDetail: string;
            lat: number;
            lon: number;
            pickUpTime: string;
            phone: string;
        };
    };
    viewCount: number;
    anotherMenus: FindSimpleOneMenu[];
    caution: string[];
}
