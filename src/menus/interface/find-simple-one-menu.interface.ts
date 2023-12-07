import { Menu } from '../entity/menu.entity';

export interface FindSimpleOneMenu {
    menuPictureUrl: Pick<Menu, 'menuPictureUrl'>;
    menuId: Pick<Menu, 'id'>;
    name: Pick<Menu, 'name'>;
    description: Pick<Menu, 'description'>;
    discountRate: Pick<Menu, 'discountRate'>;
    price: Pick<Menu, 'price'>;
}
