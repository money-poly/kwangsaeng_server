import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MenusService } from 'src/menus/menus.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { FindOneMenuDto } from './dto/find-one-menu.dto';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Get('/detail')
    async findDetailOne(@Body() dto: FindOneMenuDto) {
        const { id, lat, lon } = dto;
        return this.menusService.findDetailOne(id, lat, lon);
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@CurrentUser() user: User, @Body() dto: CreateMenuDto) {
        return await this.menusService.create(user, dto);
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param() menuId: number, @Body() dto: UpdateMenuDto) {
        return await this.menusService.update(menuId, dto);
    }
}
