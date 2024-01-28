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
        this._storeId = data.storeid;
        this._storeName = data.storename;
        this._menuId = data.menuid;
        this._menuName = data.menuname;
        this._menuPictureUrl = data.menupictureurl;
        this._sellingPrice = data.sellingprice;
        this._discountRate = data.discountrate;
        this._viewCount = data.viewcount;
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
