import { IsLatitude, IsLongitude, IsNotEmpty, IsNumberString } from 'class-validator';

export class FindOneMenuDto {
    @IsNumberString()
    @IsNotEmpty()
    id: number;

    @IsLatitude()
    @IsNotEmpty()
    lat: number;

    @IsLongitude()
    @IsNotEmpty()
    lon: number;
}
