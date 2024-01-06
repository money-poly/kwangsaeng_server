import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MobileOS } from '../mobile-os.enum';

export class CreateVersionDto {
    @IsNotEmpty()
    @IsEnum(MobileOS)
    platform: MobileOS;

    @IsString()
    @IsNotEmpty()
    version: string;
}
