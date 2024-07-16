import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsLatitude, IsLongitude, IsOptional } from 'class-validator';
import { SortFilterType } from '../../enum/sort-filter-type.enum';

function toBoolean(value: string | boolean): boolean {
    return value === 'true' || value === true;
}

export class TodayUsingFoodExpensesDto {
    @IsInt()
    @Type(() => Number)
    amount: number;

    @IsEnum(SortFilterType)
    filter: SortFilterType;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => toBoolean(value))
    final?: boolean = false;

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;
}
