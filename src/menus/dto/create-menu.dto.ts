import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    saleRate: number;

    @IsString()
    description: string;

    @IsDateString()
    expiredDate: Date;
}
