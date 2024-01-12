import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Post()
    @UseGuards(AuthGuard, AdminGuard)
    async create(@Body() dto: CreateTagDto) {
        return await this.tagsService.create(dto);
    }

    @Get()
    async find() {
        return await this.tagsService.find({
            select: {
                id: true,
                name: true,
                icon: true,
                backgroundColor: true,
                content: true,
                description: true,
                textColor: true,
            },
        });
    }

    @Put('/:id')
    @UseGuards(AuthGuard, AdminGuard)
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTagDto) {
        return await this.tagsService.update(id, dto);
    }
}
