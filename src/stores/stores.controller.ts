import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/global/decorator/current-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { FindStoreWithLocationDto } from './dto/find-store-with-location.dto';
import { TransformStorePipe } from './pipe/transform-store.pipe';
import { Store } from './entity/store.entity';
import { CreateStoreValidationPipe } from './pipe/create-store-validation.pipe';
import { CreateStoreUserValidationPipe } from './pipe/create-store-user-validation.pipe';
import { OperationGuard } from './guard/operation.guard';
import { OwnerGuard } from './guard/owner.guard';

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
    onMapFindOne(@Param('storeId', TransformStorePipe) store: Store) {
        return store;
    }

    @Patch('status/:storeId')
    @UseGuards(AuthGuard, OperationGuard, OwnerGuard)
    async toggleStatus(@Param('storeId', TransformStorePipe) store: Store) {
        return await this.storesService.toggleStoreStatus(store);
    }

    // TODO: 어드민 권한
    @Patch('approve/:storeId')
    async approve(@Param('storeId', TransformStorePipe) store: Store) {
        return await this.storesService.approve(store);
    }
}
