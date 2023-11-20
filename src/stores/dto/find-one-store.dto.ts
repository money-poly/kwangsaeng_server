import { IsNotEmpty, IsNumberString } from 'class-validator';

export class FindOneStoreDto {
    @IsNumberString()
    @IsNotEmpty()
    id: number;
}
