import { Injectable } from '@nestjs/common';
import { Menus2Reader } from './implement/menus2.reader';
import { Stores2Reader } from 'src/stores2.0/implement/stores2.reader';
import { Menus2Appender } from './implement/menus2.appender';
import { Menus2Manager } from './implement/menus2.manager';
import { TodayUsedFoodExpensesDto } from './dto/today-used-food-expenses.dto';

@Injectable()
export class Menus2Service {
    constructor(
        private readonly storeReader: Stores2Reader,
        private readonly menusReader: Menus2Reader,
        private readonly menusAppender: Menus2Appender,
        private readonly menusManager: Menus2Manager,
    ) {}

    async todayUsedFoodExpenses(dto: TodayUsedFoodExpensesDto) {
        return await this.menusReader.readTodayUsedFoodExpenses(dto.amount, dto.filter, dto.final, dto.lat, dto.lon);
    }
}
