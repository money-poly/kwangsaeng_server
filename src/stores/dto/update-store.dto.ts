import { IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class UpdateStoreDto extends PartialType(
    PickType(CreateStoreDto, ['name', 'address', 'addressDetail', 'phone', 'operationTimes']),
) {
    @IsUrl()
    @IsOptional()
    storePictureUrl?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
