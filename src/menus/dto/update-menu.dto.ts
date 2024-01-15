import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MenuStatus } from '../enum/menu-status.enum';
import { UpdateMenuArgs } from '../interface/update-menu.interface';

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
}
