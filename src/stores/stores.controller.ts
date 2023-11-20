import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { FindOneStoreDto } from './dto/find-one-store.dto';
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

    @Get('/map/location')
    async findStoresWithLocation(@Body() dto: FindStoreWithLocationDto) {
        const { lat, lon, range } = dto;
        return await this.storesService.findStoresWithLocation(lat, lon, range);
    }

    @Get('/map/:id')
    onMapFindOne(@Param() dto: FindOneStoreDto) {
        const { id } = dto;
        return this.storesService.findOne(id, {}, { name: true, description: true });
    }
}
