import { IsLatitude, IsLongitude, IsOptional } from 'class-validator';

export class FindOneMenuDetailDto {
    @IsOptional()
    @IsLatitude()
    lat: number;

    @IsOptional()
    @IsLongitude()
    lon: number;
}
