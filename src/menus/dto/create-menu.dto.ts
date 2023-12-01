import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateMenuArgs } from '../interface/create-menu.interface';

export class CreateMenuDto implements CreateMenuArgs {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    sale_rate: number;

    @IsString()
    description: string;

    @IsDateString()
    expiredDate: Date;
}
