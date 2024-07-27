import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';
import { SortFilterType } from '../../enum/sort-filter-type.enum';
import { MenuCategories } from 'src/menus2.0/enum/categories.enum';

function toString(value: number | string): string {
    return String(value);
}

export class LowStockDto {
    @IsEnum(SortFilterType)
    type: SortFilterType;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    lastId?: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => toString(value))
    lastValue?: string;

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;

    @IsEnum(MenuCategories)
    category: MenuCategories;
}
