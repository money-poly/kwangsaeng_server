import { IsNotEmpty, IsNumber } from 'class-validator';
import { UpdateMenuCountArgs } from '../interface/update-count.interface';

export class UpdateMenuCountDto implements UpdateMenuCountArgs {
    @IsNumber()
    @IsNotEmpty()
    count: number;
}
