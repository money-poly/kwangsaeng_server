import { Injectable } from '@nestjs/common';
import { Stores2Reader } from './implement/stores2.reader';
import { FindStoreDetailDto } from './dto/request/detail-info.dto';
import { Stores2Validator } from './implement/stores2.validator';
import { Menus2Reader } from 'src/menus2.0/implement/menus2.reader';
import { CategoriesService } from 'src/categories/categories.service';
import { ResponseRefiner } from 'src/global/util/response-refiner';
import { FindStoreRes } from './dto/response/detail-info.dto';
import { LocationUtil } from './util/pickup-time.util';
import { CAUTION_TEXT } from 'src/global/common/caution.constant';

@Injectable()
export class Stores2Service {
    constructor(
        private readonly storesReader: Stores2Reader,
        private readonly storesValidator: Stores2Validator,
        private readonly menusReader: Menus2Reader,

        // TODO) category implement layer 생성시 implement layer를 의존성 주입하며 대체
        private readonly categoriesService: CategoriesService,
    ) {}

    async findDetailOne(id: number, dto: FindStoreDetailDto) {
        const store = await this.storesReader.readOne(id);
        await this.storesValidator.checkApprove(store);
        await this.storesValidator.checkOpen(store);

        // TODO category implement layer로 변경
        const categories = await this.categoriesService.findCategoriesNameByStore(store);

        const normalMenus = await this.menusReader.readInOrdeThroughStore(store);

        const discountSchduleMenus = await this.menusReader.readDiscountSchedule(store);

        return ResponseRefiner.refineObject(
            {
                store,
                categories,
                menus: normalMenus,
                discountSchdule: discountSchduleMenus,
                pickUpTime: LocationUtil.measurePickUpTime(
                    store.detail.cookingTime,
                    store.detail.lat,
                    dto.lat,
                    store.detail.lon,
                    dto.lon,
                ),
                caution: CAUTION_TEXT,
            },
            FindStoreRes,
        );
    }
}
