import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { CreateMenuDto } from './dto/create-menu.dto';

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@CurrentUser() user: User, @Body() dto: CreateMenuDto) {
        return await this.menusService.create(user, dto);
    }
}
