import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateMenuArgs } from '../interface/create-menu.interface';
import { MenuStatus } from '../enum/menu-status.enum';

export class CreateMenuDto implements CreateMenuArgs {
    @IsNumber()
    @IsNotEmpty()
    storeId: number;

    @IsString()
    menuPictureUrl?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(MenuStatus)
    @IsNotEmpty()
    status: MenuStatus;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    discountRate: number;

    @IsString()
    description: string;
}
