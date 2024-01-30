import { Category } from 'src/categories/entity/category.entity';
import { Menu } from 'src/menus/entity/menu.entity';
import { Store } from '../entity/store.entity';
import { StoreDetail } from '../entity/store-detail.entity';
import { User } from 'src/users/entity/user.entity';

export interface FindOneStoreReturnValue {
    id: Pick<Store, 'id'>;
    name: Pick<Store, 'name'>;
    categories: Pick<Category, 'name'>[];
    detail: {
        storePictureUrl: Pick<StoreDetail, 'storePictureUrl'>;
        address: Pick<StoreDetail, 'address'>;
        addressDetail: Pick<StoreDetail, 'addressDetail'>;
        lat: Pick<StoreDetail, 'lat'>;
        lon: Pick<StoreDetail, 'lon'>;
        phone: Pick<User, 'phone'>;
        cookingTime: Pick<StoreDetail, 'cookingTime'>;
        operationTimes: Pick<StoreDetail, 'operationTimes'>;
        pickupTime: string;
        menuOrders: Pick<StoreDetail, 'menuOrders'>;
    };
    menus?: Menu[];
}
