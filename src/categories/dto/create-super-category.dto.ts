import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSuperCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;
}
