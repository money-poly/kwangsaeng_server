import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateMenuOrderDto {
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    order: number[];
}
