import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber } from 'class-validator';

export class FindStoreWithLocationDto {
    @IsLatitude()
    @IsNotEmpty()
    lat: number;

    @IsLongitude()
    @IsNotEmpty()
    lon: number;

    @IsNumber()
    @IsNotEmpty()
    range: number;
}
