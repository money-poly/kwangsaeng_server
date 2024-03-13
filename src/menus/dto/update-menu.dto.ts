import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateMenuArgs } from '../interface/update-menu.interface';
import { Type } from 'class-transformer';
import { CountryOfOrigin } from './create-menu.dto';

export class UpdateMenuDto implements UpdateMenuArgs {
    @IsOptional()
    @IsString()
    menuPictureUrl?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    discountRate?: number;

    @IsOptional()
    @IsNumber()
    sellingPrice?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    expiredDate?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CountryOfOrigin)
    countryOfOrigin?: CountryOfOrigin[];
}
