import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindOneStoreDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @IsNumberString()
    id: number;
}
