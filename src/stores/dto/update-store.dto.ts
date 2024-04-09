import { ArrayNotEmpty, IsNotIn, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { UpdateStoreArgs } from '../interfaces/update-store.interface';
import { OperationTimes } from './create-store.dto';

export class UpdateStoreDto implements UpdateStoreArgs {
    @IsString()
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsString()
    @IsOptional()
    addressDetail?: string;

    @IsOptional()
    operationTimes?: OperationTimes;

    @IsOptional()
    cookingTime?: number;

    @IsUrl()
    @IsOptional()
    storePictureUrl?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsNumber()
    @IsOptional()
    tagId?: number;

    @ArrayNotEmpty()
    @IsOptional()
    @IsNotIn([1, 2], {
        each: true,
    })
    categories?: number[];
}
