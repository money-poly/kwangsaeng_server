import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';
import { SortFilterType } from '../../enum/sort-filter-type.enum';

function toString(value: number | string): string {
    return String(value);
}

export class OnSaleDto {
    @IsEnum(SortFilterType)
    type: SortFilterType;

    @IsOptional()
    @IsInt()
    lastId?: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => toString(value))
    lastValue?: string;

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;
}
