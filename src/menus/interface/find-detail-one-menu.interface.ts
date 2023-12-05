import { Store } from 'src/stores/entity/store.entity';
import { Menu } from '../entity/menu.entity';
import { FindSimpleOneMenu } from './find-simple-one-menu.interface';

export interface FindDetailOneMenu {
    mainMenuPictureUrl: Pick<Menu, 'menuPictureUrl'>;
    description: Pick<Menu, 'description'>;
    name: Pick<Menu, 'name'>;
    discountRate: Pick<Menu, 'saleRate'>;
    price: Pick<Menu, 'price'>;
    viewCount: Pick<Menu, 'viewCount'>;
    storeNmae: Pick<Store, 'name'>;
    storeAddress: Pick<Store, 'address'>;
    phone: Pick<Store, 'phone'>;
    expiredDate: null;
    storeLatitude: Pick<Store, 'latitude'>;
    storeLongitude: Pick<Store, 'longitude'>;
    countryOfOrigin: Pick<Store, 'countryOfOrigin'>;
    anotherMenus: FindSimpleOneMenu[];
    notice: string[];
}
