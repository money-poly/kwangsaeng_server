import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class UpdateRecommandDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'Content is too short' })
    content: string;

    @IsString()
    @IsNotEmpty()
    type: string;
}
