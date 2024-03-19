import { ArrayNotEmpty, IsNotIn, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class UpdateStoreDto extends PartialType(
    PickType(CreateStoreDto, [
        'name',
        'address',
        'addressDetail',
        'operationTimes',
        'cookingTime',
        'phone',
        'categories',
    ]),
) {
    @IsUrl()
    @IsOptional()
    storePictureUrl?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    tagId?: number;

    @IsString()
    @IsOptional()
    phone?: string;

    @ArrayNotEmpty()
    @IsNotIn([1, 2], {
        each: true,
    })
    categories?: number[];
}
