import { IsEnum, IsNumber, IsString } from 'class-validator';
import { MenuStatus } from '../enum/menu-status.enum';
import { UpdateMenuArgs } from '../interface/update-menu.interface';

export class UpdateMenuDto implements UpdateMenuArgs {
    @IsString()
    image?: string;

    @IsString()
    name?: string;

    @IsEnum(MenuStatus)
    status?: MenuStatus;

    @IsNumber()
    price?: number;

    @IsNumber()
    sellingPrice?: number;

    @IsString()
    description?: string;
}
