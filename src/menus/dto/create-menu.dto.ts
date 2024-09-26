import {
    IsDate,
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    ValidateNested,
} from 'class-validator';
import { CreateMenuArgs } from '../interface/create-menu.interface';
import { MenuStatus } from '../enum/menu-status.enum';
import { Type } from 'class-transformer';

export class CountryOfOrigin {
    @IsString()
    ingredient: string;

    @IsString()
    origin: string;
}
export class CreateMenuDto implements CreateMenuArgs {
    @IsNumber()
    @IsNotEmpty()
    storeId: number;

    @IsUrl()
    @IsOptional()
    menuPictureUrl?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDate()
    @IsOptional()
    expiredDate: Date;

    @IsEnum(MenuStatus)
    @IsNotEmpty()
    status: MenuStatus;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    discountRate: number;

    @IsNumber()
    @IsNotEmpty()
    sellingPrice: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => CountryOfOrigin)
    countryOfOrigin: CountryOfOrigin[];
}
