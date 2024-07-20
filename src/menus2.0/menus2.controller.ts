import { Controller, Get, Query } from '@nestjs/common';
import { Menus2Service } from './menus2.service';
import { TodayUsingFoodExpensesDto } from './dto/request/today-using-food-expenses.dto';

@Controller('menus2')
export class Menus2Controller {
    constructor(private readonly menusService: Menus2Service) {}

    @Get('today-using-food-expenses')
    async todayUsingFoodExpenses(@Query() dto: TodayUsingFoodExpensesDto) {
        return this.menusService.todayUsingFoodExpenses(dto);
    }
}
