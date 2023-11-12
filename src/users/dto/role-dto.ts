import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoleDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;
}
