import { Menu } from 'src/menus/entity/menu.entity';

export interface FindOneStoreReturnValue {
    id: number;
    name: string;
    categories: {
        name: string;
    }[];
    detail: {
        storePictureUrl: string;
        address: string;
        addressDetail?: string;
        lat: number;
        lon: number;
        phone: string;
        cookingTime: number;
        operationTimes: {
            endedAt: string;
            startedAt: string;
        };
        pickUpTime: string;
        menuOrders: string;
    };
    menus?: Menu[];
}
