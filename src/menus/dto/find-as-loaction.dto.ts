import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
import { LocationInfo } from '../interface/location-info.interface';

export class FindAsLocationDto implements LocationInfo {
    @IsLatitude()
    @IsNotEmpty()
    lat: number;

    @IsLongitude()
    @IsNotEmpty()
    lon: number;
}
