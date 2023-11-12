import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FindStoresDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    id: string;
}
