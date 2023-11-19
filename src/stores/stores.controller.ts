import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { FindOneStoreDto } from './dto/find-one-store.dto';
import { FindStoresDto } from './dto/find-stores.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { FindStoreWithLocationDto } from './dto/find-store-with-location.dto';

@Controller('stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@CurrentUser() user: User, @Body() dto: CreateStoreDto) {
        return await this.storesService.create(user, dto);
    }

    @Get('/location')
    async findStoresWithLocation(@Body() dto: FindStoreWithLocationDto) {
        return await this.storesService.findStoresWithLocation(dto);
    }

    @Get('/map/:id')
    onMapFindOne(@Param() dto: FindOneStoreDto) {
        return this.storesService.findOne(dto);
    }

    @Get()
    find(@Query() dto: FindStoresDto) {
        return this.storesService.find(dto);
    }
}
