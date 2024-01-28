import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { Keyword } from './entity/keyword.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from 'src/stores/stores.module';

@Module({
    imports: [TypeOrmModule.forFeature([Keyword]), StoresModule],
    providers: [SearchService],
})
export class SearchModule {}
