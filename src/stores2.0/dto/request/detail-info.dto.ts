import { IsLatitude, IsLongitude } from 'class-validator';

export class FindStoreDetailDto {
    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;
}
