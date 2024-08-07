import { CAUTION_TEXT } from 'src/global/common/caution.constant';
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
    }[];
    discountSchdule: {
        menus: {
            id: number;
            name: string;
            discountRate: number;
            sellingPrice: number;
            description?: string;
            price: number;
            menuPictureUrl?: string;
            count: number;
        }[];
        startedAt: string;
    };
    caution: string[];

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
        };
        this.menus = data.menus;
        this.discountSchdule = {
            menus: data.discountSchdule.map((menu) => ({
                id: menu.id,
                name: menu.name,
                discountRate: menu.discountRate,
                sellingPrice: menu.sellingPrice,
                description: menu.description,
                price: menu.price,
                menuPictureUrl: menu.menuPictureUrl,
                count: menu.count,
            })),
            startedAt: data.discountSchdule[0].prearrangedSaleTime,
        };
        this.caution = CAUTION_TEXT;
    }
}
