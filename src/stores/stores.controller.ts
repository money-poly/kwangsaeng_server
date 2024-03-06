import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { FindStoreWithLocationDto } from './dto/find-store-with-location.dto';
import { Store } from './entity/store.entity';
import { CreateStoreValidationPipe } from './pipe/create-store-validation.pipe';
import { CreateStoreUserValidationPipe } from './pipe/create-store-user-validation.pipe';
import { OperationGuard } from './guard/operation.guard';
import { OwnerGuard } from './guard/owner.guard';
import { UpdateStoreDto } from './dto/update-store.dto';
import { TransformStoreInterceptor } from 'src/global/interceptor/transform-entity.interceptor';
import { CurrentStore } from 'src/global/decorator/current-store.decorator';
import { UseEntityTransformer } from 'src/global/decorator/entity-transformer.decorator';
import { CAUTION_TEXT } from 'src/global/common/caution.constant';
import { FindStoreDetailDto } from './dto/find-store-detail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { S3Exception } from 'src/global/exception/s3-exception';
import { StoresService } from './stores.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @CurrentUser(CreateStoreUserValidationPipe) user: User,
        @Body(CreateStoreValidationPipe) dto: CreateStoreDto,
    ) {
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
    onMapFindOne(@Param('storeId', ParseIntPipe) storeId: number) {
        return this.storesService.onMapFindStore(storeId);
    }

    @Patch('status/:storeId')
    @UseGuards(AuthGuard, OperationGuard, OwnerGuard)
    @UseEntityTransformer<Store>(TransformStoreInterceptor)
    async toggleStatus(@CurrentStore() store: Store) {
        return await this.storesService.toggleStoreStatus(store);
    }

    @Patch('approve/:storeId')
    @UseGuards(AuthGuard, AdminGuard)
    @UseEntityTransformer<Store>(TransformStoreInterceptor)
    async approve(@CurrentStore() store: Store) {
        return await this.storesService.approve(store);
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
    @UseEntityTransformer<Store>(TransformStoreInterceptor)
    async findOneStore(@CurrentStore() store: Store, @Query() dto: FindStoreDetailDto) {
        const storeData = await this.storesService.findStore(store, dto);
        return { ...storeData, caution: CAUTION_TEXT };
    }

    @Put('/:storeId')
    @UseGuards(AuthGuard, OwnerGuard)
    @UseEntityTransformer<Store>(TransformStoreInterceptor, {
        loadEntityOptions: {
            relations: {
                detail: true,
            },
        },
        response: {
            excludeProperties: [
                'id',
                'createdDate',
                'modifiedDate',
                'deletedDate',
                'status',
                'detail.id',
                'detail.createdDate',
                'detail.modifiedDate',
                'detail.lat',
                'detail.lon',
                'detail.phone',
                'tag.createdDate',
                'tag.modifiedDate',
                'tag.description',
                'tag.icon',
                'tag.content',
                'tag.textColor',
                'tag.backgroundColor',
            ],
        },
    })
    async updateStore(@CurrentStore() store: Store, @Body() dto: UpdateStoreDto) {
        return await this.storesService.updateStore(store, dto);
    }

    @Get('basic/:storeId')
    @UseGuards(AuthGuard, OperationGuard, OwnerGuard)
    async basicInfo(@Param('storeId', ParseIntPipe) storeId: number) {
        return await this.storesService.basicInfo(storeId);
    }

    @Get('/operation/:id')
    async checkOperationStatus(@Param('id', ParseIntPipe) storeId: number) {
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
