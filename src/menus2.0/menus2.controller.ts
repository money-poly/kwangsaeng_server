import { Controller, Get, Query } from '@nestjs/common';
import { Menus2Service } from './menus2.service';
import { TodayUsedFoodExpensesDto } from './dto/today-used-food-expenses.dto';

@Controller('menus2')
export class Menus2Controller {
    constructor(private readonly menusService: Menus2Service) {}

    @Get('amount-used')
    async todayUsedFoodExpenses(@Query() dto: TodayUsedFoodExpensesDto) {
        return this.menusService.todayUsedFoodExpenses(dto);
    }
}
