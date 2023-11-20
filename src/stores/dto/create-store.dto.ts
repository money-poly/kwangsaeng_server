import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';
import { StoreCategory } from '../enum/store-category.enum';
import { CreateStoreArgs } from '../interfaces/create-store.interface';

export class CreateStoreDto implements CreateStoreArgs {
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
}
