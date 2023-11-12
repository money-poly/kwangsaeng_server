import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FindOneStoreDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    id: string;
}
