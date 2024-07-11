import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsLatitude, IsLongitude, IsOptional } from 'class-validator';
import { SortFilterType } from '../enum/sort-filter-type.enum';

export class TodayUsedFoodExpensesDto {
    @IsInt()
    @Type(() => Number)
    amount: number;

    @IsEnum(SortFilterType)
    filter: SortFilterType;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    final: boolean = false;

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;
}
