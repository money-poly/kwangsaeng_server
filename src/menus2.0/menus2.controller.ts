import { Controller, Get, Query } from '@nestjs/common';
import { Menus2Service } from './menus2.service';
import { TodayUsingFoodExpensesDto } from './dto/request/today-using-food-expenses.dto';
import { OnSaleDto } from './dto/request/on-sale.dto';

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
}
