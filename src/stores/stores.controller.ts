import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { FindOneStoreDto } from './dto/find-one-store.dto';
import { FindStoresDto } from './dto/find-stores.dto';

@Controller('stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) {}

    @Post()
    create(@Body() dto: CreateStoreDto) {
        return this.storesService.create(dto);
    }

    @Get('/:id')
    findOne(@Param() dto: FindOneStoreDto) {
        return this.storesService.findOne(dto);
    }

    @Get()
    find(@Query() dto: FindStoresDto) {
        return this.storesService.find(dto);
    }
}
