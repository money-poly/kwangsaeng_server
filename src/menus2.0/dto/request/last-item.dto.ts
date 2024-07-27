import { Transform } from 'class-transformer';
import { IsBoolean, IsLatitude, IsLongitude, IsOptional } from 'class-validator';

function toBoolean(value: string | boolean): boolean {
    return value === 'true' || value === true;
}

export class LastItemDto {
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => toBoolean(value))
    final?: boolean = false;

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;
}
