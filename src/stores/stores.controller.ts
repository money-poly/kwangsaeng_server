import { Body, Controller, Get, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
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

    @Get('/map/location')
    async findStoresWithLocation(@Body() dto: FindStoreWithLocationDto) {
        return await this.storesService.findStoresWithLocation(dto);
    }

    // TODO: 메뉴 얼추 완성되면 디자인에 맞게 API 수정 필요
    @Get('/map/:storeId')
    @UseEntityTransformer<Store>(TransformStoreInterceptor)
    onMapFindOne(@CurrentStore() store: Store) {
        return store;
    }

    @Patch('status/:storeId')
    @UseGuards(AuthGuard, OperationGuard, OwnerGuard)
    @UseEntityTransformer<Store>(TransformStoreInterceptor)
    async toggleStatus(@CurrentStore() store: Store) {
        return await this.storesService.toggleStoreStatus(store);
    }

    // TODO: 어드민 권한
    @Patch('approve/:storeId')
    @UseEntityTransformer<Store>(TransformStoreInterceptor)
    async approve(@CurrentStore() store: Store) {
        return await this.storesService.approve(store);
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
            ],
        },
    })
    async updateStore(@CurrentStore() store: Store, @Body() dto: UpdateStoreDto) {
        return await this.storesService.updateStore(store, dto);
    }
}
