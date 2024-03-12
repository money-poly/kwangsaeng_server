import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateMenuArgs } from '../interface/create-menu.interface';
import { MenuStatus } from '../enum/menu-status.enum';

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

    @IsDateString()
    @IsOptional()
    expiredDate?: string;

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
    salePrice: number;

    @IsString()
    @IsOptional()
    description?: string;
}
