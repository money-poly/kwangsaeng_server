import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entity/store.entity';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entity/user.entity';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamoSchema } from './dynamo.schema';
import { StoreDetail } from './entity/store-detail.entity';
import { BusinessDetail } from './entity/business-detail.entity';
import { StoreApprove } from './entity/store-approve.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Store, User, StoreDetail, BusinessDetail, StoreApprove]),
        DynamooseModule.forFeature([{ name: 'Store-Menu', schema: DynamoSchema }]),
        CategoriesModule,
        UsersModule,
    ],
    controllers: [StoresController],
    providers: [StoresService, StoresRepository, UsersRepository],
    exports: [StoresService],
})
export class StoresModule {}
