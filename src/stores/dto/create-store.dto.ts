import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { StoreCategory } from '../enum/store-category.enum';

export class CreateStoreDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEnum(StoreCategory)
    category: StoreCategory;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsLatitude()
    latitude: number;

    @IsNotEmpty()
    @IsLongitude()
    longitude: number;

    @IsString()
    @IsNotEmpty()
    @IsNumberString()
    userId: number;
}
