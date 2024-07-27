export class LastItemRes {
    menus: {
        menu: {
            id: number;
            menuPictureUrl: string;
            name: string;
            price: number;
            discountRate: number;
            sellingPrice: number;
            count: number;
        };
        store: {
            id: number;
            name: string;
        };
    }[];

    constructor(data: any) {
        this.menus = data.menus.map((menuData) => ({
            menu: {
                id: menuData.menuId,
                menuPictureUrl: menuData.menuPictureUrl,
                name: menuData.menuName,
                price: menuData.price,
                discountRate: menuData.discountRate,
                sellingPrice: menuData.sellingPrice,
                count: menuData.count,
            },
            store: {
                id: menuData.storeId,
                name: menuData.storeName,
            },
        }));
    }
}
