import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';

@Module({
  providers: [BannersService],
  controllers: [BannersController]
})
export class BannersModule {}
