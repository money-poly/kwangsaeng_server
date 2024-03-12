import {
    ArrayNotEmpty,
    IsNotEmpty,
    IsNotIn,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OperationTimes {
    @IsString()
    @Length(5, 5)
    startedAt: string;

    @IsString()
    @Length(5, 5)
    endedAt: string;
}

export class CreateStoreDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    businessLeaderName: string;

    @IsString()
    @IsNotEmpty()
    businessNum: string;

    @ArrayNotEmpty()
    @IsNotIn([1, 2], {
        each: true,
    })
    categories: number[];

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsOptional()
    addressDetail?: string;

    @IsUrl()
    @IsOptional()
    storePictureUrl?: string;

    @IsNotEmpty()
    @IsNumber()
    cookingTime: number;

    @ValidateNested()
    @Type(() => OperationTimes)
    operationTimes: OperationTimes;

    @IsString()
    phone: string;

    @IsString()
    openedDate: string;
}
