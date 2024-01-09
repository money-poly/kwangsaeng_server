import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BannersService } from './banners.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBannerDto } from './dto/create-banner.dto';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@Controller('banners')
export class BannersController {
    constructor(private readonly bannerService: BannersService) {}

    @Post('/upload')
    @UseGuards(AuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.MulterS3.File, @Body() formData: object) {
        const dto: CreateBannerDto = JSON.parse(JSON.stringify(formData));
        await this.bannerService.create(dto, file);
    }

    @Get('')
    async findAll() {
        return await this.bannerService.findAll();
    }
}
