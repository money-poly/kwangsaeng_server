import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';

export class FindStoreWithLocationDto {
    @IsLatitude()
    @IsNotEmpty()
    lat: number;

    @IsLongitude()
    @IsNotEmpty()
    lon: number;

    @IsString()
    @IsNotEmpty()
    range: number;
}
