import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entity/tag.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    providers: [TagsService],
    controllers: [TagsController],
    exports: [TagsService],
})
export class TagsModule {}
