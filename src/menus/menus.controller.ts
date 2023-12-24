import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MenusService } from 'src/menus/menus.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateMenuValidationPipe } from './pipe/create-menu-validation.pipe';
import { TransformMenuPipe } from './pipe/transform-menu.pipe';
import { Menu } from './entity/menu.entity';
import { FindOneMenuDto } from './dto/find-one-menu.dto';

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Get('/detail/:id')
    async findDetailOne(@Param('id', TransformMenuPipe) menu: Menu, @Body() loc: FindOneMenuDto) {
        return this.menusService.findDetailOne(menu, loc);
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@CurrentUser() user: User, @Body(CreateMenuValidationPipe) dto: CreateMenuDto) {
        return await this.menusService.create(user, dto);
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param('id', TransformMenuPipe) menu: Menu, @Body() dto: UpdateMenuDto) {
        return await this.menusService.update(menu, dto);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    async delete(@Param('id', TransformMenuPipe) menu: Menu) {
        return await this.menusService.delete(menu);
    }

    @Get('/seller/:storeId')
    async findManyForSeller(@Param('storeId') storeId: number) {
        return await this.menusService.findManyForSeller(storeId);
    }
}
