import { Injectable } from '@nestjs/common';
import { Menus2Reader } from './implement/menus2.reader';
import { Stores2Reader } from 'src/stores2.0/implement/stores2.reader';
import { Menus2Appender } from './implement/menus2.appender';
import { Menus2Manager } from './implement/menus2.manager';
import { ResponseRefiner } from 'src/global/util/response-refiner';
import { TodayUsingFoodExpensesDto } from './dto/request/today-using-food-expenses.dto';
import { TodayUsingFoodExpensesRes } from './dto/response/today-using-food-expenses.dto';
import { OnSaleDto } from './dto/request/on-sale.dto';
import { OnSaleRes } from './dto/response/on-sale.dto';
import { LastItemDto } from './dto/request/last-item.dto';
import { LowStockDto } from './dto/request/low-stock.dto';
import { LowStockRes } from './dto/response/low-stock.dto';
import { LastItemRes } from './dto/response/last-item.dto';
import { UpcomingSalesDto } from './dto/request/upcoming-sales.dto';
import { UpcomingSalesRes } from './dto/response/upcoming-sales.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TopOrdersDto } from './dto/request/top-orders.dto';
import { TopOrdersRes } from './dto/response/top-orders.dto';
import { Seller } from 'src/users/entity/seller.entity';
import { CreateMenuDto } from 'src/menus/dto/create-menu.dto';

@Injectable()
export class Menus2Service {
    constructor(
        private readonly storeReader: Stores2Reader,
        private readonly menusReader: Menus2Reader,
        private readonly menusAppender: Menus2Appender,
        private readonly menusManager: Menus2Manager,
    ) {}

    async craete(user: Seller, dto: CreateMenuDto) {
        return await this.menusAppender.create(user, dto);
    }

    async todayUsingFoodExpenses(dto: TodayUsingFoodExpensesDto) {
        const menus = await this.menusReader.readTodayUsingFoodExpenses(
            dto.amount,
            dto.type,
            dto.final,
            dto.lat,
            dto.lon,
        );

        return ResponseRefiner.refineObject(menus, TodayUsingFoodExpensesRes);
    }

    async onSale(dto: OnSaleDto) {
        const menus = await this.menusReader.readOnSale(dto.type, dto.lat, dto.lon, dto.lastId, dto.lastValue);

        return ResponseRefiner.refineObject(menus, OnSaleRes);
    }

    async lastItem(dto: LastItemDto) {
        const menus = await this.menusReader.readLastItem(dto.lat, dto.lon, dto.final);

        return ResponseRefiner.refineObject(menus, LastItemRes);
    }

    async lowStock(dto: LowStockDto) {
        const menus = await this.menusReader.readLowStock(
            dto.type,
            dto.category,
            dto.lat,
            dto.lon,
            dto.lastId,
            dto.lastValue,
        );

        return ResponseRefiner.refineObject(menus, LowStockRes);
    }

    async upcomingSales(dto: UpcomingSalesDto) {
        const menus = await this.menusReader.readUpcomingSales(dto.lat, dto.lon);

        return ResponseRefiner.refineObject(menus, UpcomingSalesRes);
    }

    async topOrders(dto: TopOrdersDto) {
        const menus = await this.menusReader.readTopOrders(
            dto.type,
            dto.lat,
            dto.lon,
            dto.category,
            dto.lastId,
            dto.lastValue,
        );

        return ResponseRefiner.refineObject(menus, TopOrdersRes);
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    private async updateMenuStatusAboutPrearragedSale() {
        await this.menusManager.managePrearrangedSale();
    }
}
