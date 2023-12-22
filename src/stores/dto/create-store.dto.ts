import {
    ArrayNotEmpty,
    IsLatitude,
    IsLongitude,
    IsNotEmpty,
    IsNotIn,
    IsNumber,
    IsString,
    Length,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OperationTimes {
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
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    @IsLatitude()
    lat: number;

    @IsNotEmpty()
    @IsLongitude()
    lon: number;

    @IsNotEmpty()
    @IsNumber()
    cookingTime: number;

    @ValidateNested()
    @Type(() => OperationTimes)
    operationTimes: OperationTimes;
}
