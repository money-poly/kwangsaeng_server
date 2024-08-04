import { Controller, Get, Param, Query } from '@nestjs/common';
import { Stores2Service } from './stores2.service';
import { SkipThrottle } from '@nestjs/throttler';
import { FindStoreDetailDto } from './dto/request/detail-info.dto';

@Controller('stores2')
export class Stores2Controller {
    constructor(private readonly storesService: Stores2Service) {}

    @SkipThrottle()
    @Get(':id')
    async findDetailOne(@Param('id') id: number, @Query() dto: FindStoreDetailDto) {
        return await this.storesService.findDetailOne(id, dto);
    }
}
