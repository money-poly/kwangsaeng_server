import { IsBoolean, IsNotEmpty, IsString, IsUrl, isURL } from 'class-validator';
import { CreateBannerInterface } from '../interface/create-banner.interface';

export class CreateBannerDto implements CreateBannerInterface {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    isVisible: boolean;
}
