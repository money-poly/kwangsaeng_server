import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class FindOneMenuDto {
    @IsLatitude()
    @IsNotEmpty()
    lat: number;

    @IsLongitude()
    @IsNotEmpty()
    lon: number;
}
