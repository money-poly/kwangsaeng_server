import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { UpdateStatusArgs } from '../interface/update-status.interface';
import { MenuStatus } from '../enum/menu-status.enum';

export class UpdateMenuStatusDto implements UpdateStatusArgs {
    @IsEnum(MenuStatus)
    @IsNotEmpty()
    prevStatus: MenuStatus;

    @IsEnum(MenuStatus)
    @IsNotEmpty()
    updateStatus: MenuStatus;
}
