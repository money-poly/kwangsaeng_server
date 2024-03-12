import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { MenusService } from 'src/menus/menus.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ModifyMenuValidationPipe } from './pipe/modify-menu-validation.pipe';
import { TransformMenuPipe } from './pipe/transform-menu.pipe';
import { Menu } from './entity/menu.entity';
import { FindOneMenuDetailDto } from './dto/find-one-menu.dto';
import { UpdateMenuOrderDto } from './dto/update-order.dto';
import { UseEntityTransformer } from 'src/global/decorator/entity-transformer.decorator';
import { Store } from 'src/stores/entity/store.entity';
import { TransformStoreInterceptor } from 'src/global/interceptor/transform-entity.interceptor';
import { CurrentStore } from 'src/global/decorator/current-store.decorator';
import { FindAsLocationDto } from './dto/find-as-loaction.dto';
import { MenuFilterType } from './enum/discounted-menu-filter-type.enum';
import { MenuStatus } from './enum/menu-status.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMenuStatusDto } from './dto/update-status.dto';
import { S3Exception } from 'src/global/exception/s3-exception';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @SkipThrottle()
    @Get('/detail/:id')
    async findDetailOne(@Param('id') menuId: number, @Query() dto: FindOneMenuDetailDto) {
        return this.menusService.findDetailOne(menuId, dto);
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(@CurrentUser() user: User, @Body(ModifyMenuValidationPipe) dto: CreateMenuDto) {
        return await this.menusService.create(user, dto);
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param('id', TransformMenuPipe) menu: Menu, @Body() dto: UpdateMenuDto) {
        return await this.menusService.update(menu, dto);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    async delete(@CurrentUser() user: User, @Param('id', TransformMenuPipe) menu: Menu) {
        return await this.menusService.delete(user, menu);
    }

    @SkipThrottle()
    @Get('/seller/:storeId')
    @UseGuards(AuthGuard)
    @UseEntityTransformer<Store>(TransformStoreInterceptor)
    async findManyForSeller(@CurrentStore() store: Store, @Query('status') status: MenuStatus) {
        return await this.menusService.findManyForSeller(store, status);
    }

    @Put('/order/:storeId')
    @UseGuards(AuthGuard)
    @UseEntityTransformer<Store>(TransformStoreInterceptor)
    async updateOrder(@CurrentStore() store: Store, @Body() dto: UpdateMenuOrderDto) {
        return await this.menusService.updateOrder(store, dto);
    }

    @SkipThrottle()
    @Get('/max-discount')
    async findMaxDiscount(@Query() dto: FindAsLocationDto) {
        return await this.menusService.findMaxDiscount(dto);
    }

    @SkipThrottle()
    @Get('/discounted')
    async findManyDiscount(@Query('type') type: MenuFilterType, @Query() dto: FindAsLocationDto) {
        return await this.menusService.findManyDiscount(type, dto);
    }

    @Put('/status/:id')
    @UseGuards(AuthGuard)
    async updateStatus(@Param('id', TransformMenuPipe) menu: Menu, @Body() dto: UpdateMenuStatusDto) {
        return await this.menusService.updateStatus(menu, dto);
    }

    @Post('upload/:storeId')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.MulterS3.File) {
        if (file === undefined) {
            throw S3Exception.UPLOAD_FAIL;
        }
        return file.location;
    }
}
