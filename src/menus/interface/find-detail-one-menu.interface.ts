import { FindSimpleOneMenu } from './find-simple-one-menu.interface';

export interface FindDetailOneMenu {
    mainMenuPictureUrl: string;
    description: string;
    name: string;
    discountRate: number;
    price: number;
    storeName: string;
    expiredDate?: Date;
    anotherMenus: FindSimpleOneMenu[];
    notice: string[];
}
