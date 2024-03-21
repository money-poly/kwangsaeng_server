import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { VersionService } from './version.service';
import { FindVersionDto } from './dto/find-version.dto';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';

@Controller('version')
export class VersionController {
    constructor(private readonly versionService: VersionService) {}

    @Post()
    async createVersion(@Body() dto: CreateVersionDto) {
        return await this.versionService.create(dto);
    }

    @Get()
    async findVersion(@Query() dto: FindVersionDto) {
        return await this.versionService.findVersion(dto);
    }

    @Patch()
    async updateVersion(@Body() dto: UpdateVersionDto) {
        return await this.versionService.update(dto);
    }

    @Get('/health-check')
    async healthCheck() {
        return 'Health Check OK';
    }
}
