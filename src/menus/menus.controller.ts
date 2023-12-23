import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MenusService } from 'src/menus/menus.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { FindOneMenuDto } from './dto/find-one-menu.dto';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateMenuValidationPipe } from './pipe/create-menu-validation.pipe';
import { TransformMenuPipe } from './pipe/transform-menu.pipe';

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Get('/detail/:id')
    async findDetailOne(@Param('id') id: number) {
        return this.menusService.findDetailOne(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@CurrentUser() user: User, @Body(CreateMenuValidationPipe) dto: CreateMenuDto) {
        return await this.menusService.create(user, dto);
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param('id', TransformMenuPipe) id: number, @Body() dto: UpdateMenuDto) {
        return await this.menusService.update(id, dto);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    async delete(@Param('id', TransformMenuPipe) id: number) {
        return await this.menusService.delete(id);
    }
}
