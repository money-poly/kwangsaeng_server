import { Exclude, Expose } from 'class-transformer';

export class SearchResDto {
    @Exclude() private readonly _storeId: number;
    @Exclude() private readonly _storeName: string;
    @Exclude() private readonly _menuId: number;
    @Exclude() private readonly _menuName: string;
    @Exclude() private readonly _menuPictureUrl: string;
    @Exclude() private readonly _sellingPrice: number;
    @Exclude() private readonly _discountRate: number;
    @Exclude() private readonly _viewCount: number;

    constructor(data: {
        storeid: number;
        storename: string;
        menuid: number;
        menuname: string;
        menupictureurl: string;
        sellingprice: number;
        discountrate: number;
        viewcount: number;
    }) {
        this._storeId = Number(data.storeid) || 0;
        this._storeName = data.storename;
        this._menuId = Number(data.menuid) || 0;
        this._menuName = data.menuname;
        this._menuPictureUrl = data.menupictureurl !== undefined ? data.menupictureurl : null;
        this._sellingPrice = Number(data.sellingprice) || 0;
        this._discountRate = Number(data.discountrate) || 0;
        this._viewCount = Number(data.viewcount) || 0;
    }

    @Expose({ name: 'storeName' })
    get storeName(): string {
        return this._storeName;
    }

    @Expose({ name: 'menuId' })
    get menuId(): number {
        return this._menuId;
    }

    @Expose({ name: 'menuName' })
    get menuName(): string {
        return this._menuName;
    }

    @Expose({ name: 'menuPictureUrl' })
    get menuPictureUrl(): string {
        return this._menuPictureUrl;
    }

    @Expose({ name: 'sellingPrice' })
    get sellingPrice(): number {
        return this._sellingPrice;
    }

    @Expose({ name: 'discountRate' })
    get discountRate(): number {
        return this._discountRate;
    }

    @Expose({ name: 'viewCount' })
    get viewCount(): number {
        return this._viewCount;
    }
}
