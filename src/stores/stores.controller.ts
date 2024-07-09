import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { FindStoreWithLocationDto } from 'src/stores/dto/find-store-with-location.dto';
import { CreateStoreDto } from 'src/stores/dto/create-store.dto';
import { UpdateStoreDto } from 'src/stores/dto/update-store.dto';
import { OperationGuard } from 'src/stores/guard/operation.guard';
import { OwnerGuard } from 'src/stores/guard/owner.guard';
import { CurrentStore } from 'src/global/decorator/current-store.decorator';
import { FindStoreDetailDto } from 'src/stores/dto/find-store-detail.dto';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { S3Exception } from 'src/global/exception/s3-exception';
import { StoresService } from 'src/stores/stores.service';
import { Seller } from 'src/users/entity/seller.entity';

@Controller('stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@CurrentUser() user: Seller, @Body() dto: CreateStoreDto) {
        return await this.storesService.createStore(user, dto);
    }

    @SkipThrottle()
    @Get('/map/location')
    async findStoresWithLocation(@Query() dto: FindStoreWithLocationDto) {
        return await this.storesService.findStoresWithLocation(dto);
    }

    @SkipThrottle()
    @Get('/map/:storeId')
    @UseGuards(OperationGuard)
    async onMapFindOne(@Param('storeId') storeId: number) {
        return this.storesService.onMapFindStore(storeId);
    }

    @Patch('status/:storeId')
    @UseGuards(AuthGuard, OperationGuard, OwnerGuard)
    async toggleStatus(@Param('storeId') storeId: number) {
        return await this.storesService.toggleStoreStatus(storeId);
    }

    @Patch('approve/:storeId')
    @UseGuards(AuthGuard, AdminGuard)
    async approve(@CurrentStore() storeId: number) {
        return await this.storesService.approve(storeId);
    }

    @Get('/find-using-token')
    @UseGuards(AuthGuard)
    async findStoreUsingToken(@Request() requestUser) {
        // TODO 1점주 1가게가 변경될 시, 구조 변경
        return await this.storesService.findStoreUsingToken(requestUser.user.id);
    }

    @SkipThrottle()
    @Get(':storeId')
    @UseGuards(OperationGuard)
    async findOneStore(@Param('storeId') storeId: number, @Query() dto: FindStoreDetailDto) {
        return await this.storesService.findStore(storeId, dto);
    }

    @Put('/:storeId')
    @UseGuards(AuthGuard, OwnerGuard)
    async updateStore(@Param('storeId') storeId: number, @Body() dto: UpdateStoreDto) {
        return await this.storesService.updateStore(storeId, dto);
    }

    @Get('basic/:storeId')
    @UseGuards(AuthGuard, OperationGuard, OwnerGuard)
    async basicInfo(@Param('storeId') storeId: number) {
        return await this.storesService.basicInfo(storeId);
    }

    @Get('/operation/:id')
    async checkOperationStatus(@Param('id') storeId: number) {
        return await this.storesService.checkApprove(storeId);
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
