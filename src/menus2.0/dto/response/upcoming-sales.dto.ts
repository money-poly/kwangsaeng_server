export class UpcomingSalesRes {
    saleTime: string;
    stores: {
        store: {
            id: number;
            name: string;
        };
        menus: {
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
        }[];
    }[];

    constructor(data: any[]) {
        const groupedData = this.groupBy(data, 'saleTime');
        const result = Object.keys(groupedData).map((saleTime) => ({
            saleTime: new Date(saleTime).toISOString(), // saleTime을 ISO 문자열로 변환
            stores: this.groupByStore(groupedData[saleTime]),
        }));

        // 변환된 데이터를 객체에 할당
        return result as any;
    }

    private groupBy(array: any[], key: string) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }

    private groupByStore(sales: any[]) {
        const stores = this.groupBy(sales, 'storeId');
        return Object.keys(stores).map((storeId) => ({
            stores: {
                id: storeId,
                name: stores[storeId][0].storeName,
            },
            menus: stores[storeId].map((menu) => ({
                id: menu.menuId,
                menuPictureUrl: menu.menuPictureUrl,
                name: menu.menuName,
                price: menu.price,
                discountRate: menu.discountRate,
                sellingPrice: menu.sellingPrice,
                count: menu.count,
                view: {
                    viewCount: menu.viewCount,
                },
            })),
        }));
    }
}
