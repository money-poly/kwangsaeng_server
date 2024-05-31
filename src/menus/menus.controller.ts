import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
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
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ModifyMenuValidationPipe } from './pipe/modify-menu-validation.pipe';
import { FindOneMenuDetailDto } from './dto/find-one-menu.dto';
import { UpdateMenuOrderDto } from './dto/update-order.dto';
import { FindAsLocationDto } from './dto/find-as-loaction.dto';
import { MenuFilterType } from './enum/discounted-menu-filter-type.enum';
import { MenuStatus } from './enum/menu-status.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMenuStatusDto } from './dto/update-status.dto';
import { S3Exception } from 'src/global/exception/s3-exception';
import { SkipThrottle } from '@nestjs/throttler';
import { UpdateMenuCountDto } from './dto/update-count.dto';
import { Seller } from 'src/users/entity/seller.entity';

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @SkipThrottle()
    @Get('/detail/:id')
    async findDetailOne(@Param('id') menuId: number, @Query() dto: FindOneMenuDetailDto) {
        return this.menusService.findDetailOne(menuId, dto);
    }

    // TODO 레이어 분리
    @Post()
    @UseGuards(AuthGuard)
    async create(@CurrentUser() user: Seller, @Body(ModifyMenuValidationPipe) dto: CreateMenuDto) {
        return await this.menusService.create(user, dto);
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param('id') menuId: number, @Body() dto: UpdateMenuDto, @CurrentUser() user: Seller) {
        return await this.menusService.update(menuId, dto, user);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') menuId: number, @CurrentUser() user: Seller) {
        return await this.menusService.delete(menuId, user);
    }

    @SkipThrottle()
    @Get('/seller/:storeId')
    @UseGuards(AuthGuard)
    async findManyForSeller(
        @Param('storeId') storeId: number,
        @Query('status') status: MenuStatus,
        @CurrentUser() user: Seller,
    ) {
        return await this.menusService.findManyForSeller(storeId, user, status);
    }

    @Put('/order/:id')
    @UseGuards(AuthGuard)
    async updateOrder(@Param('id') storeId: number, @Body() dto: UpdateMenuOrderDto, @CurrentUser() user: Seller) {
        return await this.menusService.updateOrder(storeId, dto, user);
    } //

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
    // TODO 회원 예외처리 및 레이어 분리
    async updateStatus(@Param('id') menuId: number, @CurrentUser() user: Seller, @Body() dto: UpdateMenuStatusDto) {
        return await this.menusService.updateStatus(menuId, user, dto);
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

    @Patch('/count/:id')
    @UseGuards(AuthGuard)
    async updateCount(@Param('id') menuId: number, @Body() dto: UpdateMenuCountDto, @CurrentUser() user: Seller) {
        return await this.menusService.updateCount(menuId, dto, user);
    }
}
