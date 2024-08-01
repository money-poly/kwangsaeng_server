import { IsLatitude, IsLongitude } from 'class-validator';

export class UpcomingSalesDto {
    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;
}
