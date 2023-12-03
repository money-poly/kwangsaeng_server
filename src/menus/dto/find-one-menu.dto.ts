import { IsNotEmpty, IsNumberString } from 'class-validator';

export class FindOneMenuDto {
    @IsNumberString()
    @IsNotEmpty()
    id: number;
}
