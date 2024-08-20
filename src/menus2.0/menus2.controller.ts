import { Controller, Get, Query } from '@nestjs/common';
import { Menus2Service } from './menus2.service';
import { TodayUsingFoodExpensesDto } from './dto/request/today-using-food-expenses.dto';
import { OnSaleDto } from './dto/request/on-sale.dto';
import { LastItemDto } from './dto/request/last-item.dto';
import { LowStockDto } from './dto/request/low-stock.dto';
import { UpcomingSalesDto } from './dto/request/upcoming-sales.dto';
import { TopOrdersDto } from './dto/request/top-orders.dto';

@Controller('menus2')
export class Menus2Controller {
    constructor(private readonly menusService: Menus2Service) {}

    @Get('today-using-food-expenses')
    async todayUsingFoodExpenses(@Query() dto: TodayUsingFoodExpensesDto) {
        return this.menusService.todayUsingFoodExpenses(dto);
    }

    @Get('on-sale')
    async onSale(@Query() dto: OnSaleDto) {
        return this.menusService.onSale(dto);
    }

    @Get('last-item')
    async lastItem(@Query() dto: LastItemDto) {
        return this.menusService.lastItem(dto);
    }

    @Get('low-stock')
    async lowStock(@Query() dto: LowStockDto) {
        return this.menusService.lowStock(dto);
    }

    @Get('upcoming-sales')
    async upcomingSales(@Query() dto: UpcomingSalesDto) {
        return this.menusService.upcomingSales(dto);
    }

    @Get('top-orders')
    async topOrders(@Query() dto: TopOrdersDto) {
        return this.menusService.topOrders(dto);
    }
}
