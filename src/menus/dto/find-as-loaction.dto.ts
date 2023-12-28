import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class FindAsLocationDto {
    @IsLatitude()
    @IsNotEmpty()
    lat: number;

    @IsLongitude()
    @IsNotEmpty()
    lon: number;
}
