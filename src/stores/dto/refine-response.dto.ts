import { MenuStatus } from 'src/menus/enum/menu-status.enum';

export class FindStoreRes {
    id: number;
    name: string;
    categories: any[];
    detail: {
        storePictureUrl: string;
        address: string;
        addressDetail?: string;
        lat: number;
        lon: number;
        phone: string;
        operationTimes: {
            endedAt: string;
            startedAt: string;
        };
        pickUpTime: string;
        menuOrders: string;
    };

    menus: {
        id: number;
        name: string;
        discountRate: number;
        sellingPrice: number;
        description?: string;
        price: number;
        status: MenuStatus;
        menuPictureUrl?: string;
        countryOfOrigin: {
            ingredient: string;
            origin: string;
        }[];
    };

    // const rsefinedCategories = categories

    constructor(data: any) {
        this.id = data.store.id;
        this.name = data.store.name;
        this.categories = data.categories.map((item) => {
            return { name: item.categoryName };
        });
        this.detail = {
            storePictureUrl: data.store.storePictureUrl ?? null,
            address: data.store.detail.address,
            addressDetail: data.store.detail.addressDetail ?? null,
            lat: data.store.detail.lat,
            lon: data.store.detail.lon,
            phone: data.store.detail.phone,
            operationTimes: {
                startedAt: data.store.detail.operationTimes.startedAt,
                endedAt: data.store.detail.operationTimes.endedAt,
            },
            pickUpTime: data.pickUpTime,
            menuOrders: data.refinedOrder,
        };
        this.menus = data.menu;
    }
}

export class AnotherRes {
    // Another Response 구조 정의
    // constructor(data: any) {
    //   // 정제 로직
    // }
}
