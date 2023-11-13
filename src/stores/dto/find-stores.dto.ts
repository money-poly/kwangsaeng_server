import { IsOptional, IsString } from 'class-validator';

export class FindStoresDto {
    @IsOptional()
    @IsString()
    name: string;
}
