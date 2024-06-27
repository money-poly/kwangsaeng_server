import { CAUTION_TEXT } from 'src/global/common/caution.constant';

export class RecommendationRes {
    menu: {
        id: number;
        menuPictureUrl: string | null;
        name: string;
        price: number;
        sellingPrice: number;
        discountRate: number;
        expiredDate: Date;
        count: number;
    };
    store: {
        id: number;
        name: string;
    };

    constructor(menus: any) {
        this.menu = {
            id: menus.menuId,
            menuPictureUrl: menus.menuPictureUrl ?? null,
            name: menus.menuName,
            price: menus.price,
            sellingPrice: menus.sellingPrice,
            discountRate: menus.discountRate,
            expiredDate: menus.expiredDate,
            count: menus.count,
        };
        this.store = {
            id: menus.storeId,
            name: menus.storeName,
        };
    }
}

export class FindDeatailOneRes {
    id: number;
    menuPictureUrl?: string;
    description?: string;
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
            addressDetail?: string;
            lat: number;
            lon: number;
            pickUpTime: string;
            phone: string;
        };
    };
    anotherMenus?: {
        menuPictureUrl?: string;
        menuId: number;
        name: string;
        description?: string;
        discountRate: number;
        sellingPrice: number;
    }[];
    viewCount: number;
    caution: string[];

    constructor(data: any) {
        this.id = data.menu.id;
        this.menuPictureUrl = data.menu.menuPictureUrl ?? null;
        this.name = data.menu.name;
        this.description = data.menu.description ?? null;
        this.discountRate = data.menu.discountRate;
        this.price = data.menu.price;
        this.sellingPrice = data.menu.sellingPrice;
        this.count = data.menu.count;
        this.expiredDate = data.menu.expiredDate ?? null;
        this.countryOfOrigin = data.menu.countryOfOrigin;
        this.store = {
            id: data.store.id,
            name: data.store.name,
            detail: {
                address: data.store.detail.address,
                addressDetail: data.store.detail.addressDetail ?? null,
                lat: data.store.detail.lat,
                lon: data.store.detail.lon,
                pickUpTime: data.pickUpTime,
                phone: data.store.detail.phone,
            },
        };
        this.anotherMenus = data.anotherMenus ?? null;
        this.viewCount = data.menu.view.viewCount;
        this.caution = CAUTION_TEXT;
    }
}

export class AnotherRes {
    // Another Response 구조 정의
    // constructor(data: any) {
    //   // 정제 로직
    // }
}
