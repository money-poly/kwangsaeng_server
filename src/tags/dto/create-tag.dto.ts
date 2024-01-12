import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsNotEmpty()
    icon: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    textColor: string;

    @IsString()
    @IsNotEmpty()
    backgroundColor: string;
}
