import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entity/store.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Store])],
    controllers: [StoresController],
    providers: [StoresService, StoresRepository],
})
export class StoresModule {}
