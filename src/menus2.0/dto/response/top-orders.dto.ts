export class TopOrdersRes {
    menus: {
        menu: {
            id: number;
            menuPictureUrl: string;
            name: string;
            price: number;
            discountRate: number;
            sellingPrice: number;
            count: number;
            view: {
                viewCount: number;
            };
        };
        store: {
            id: number;
            name: string;
        };
    }[];

    constructor(data: any) {
        this.menus = data.map((menuData) => ({
            menu: {
                id: menuData.menuId,
                menuPictureUrl: menuData.menuPictureUrl,
                name: menuData.menuName,
                price: menuData.price,
                discountRate: menuData.discountRate,
                sellingPrice: menuData.sellingPrice,
                count: menuData.count,
                view: {
                    viewCount: menuData.viewCount,
                },
            },
            store: {
                id: menuData.storeId,
                name: menuData.storeName,
            },
        }));
    }
}
