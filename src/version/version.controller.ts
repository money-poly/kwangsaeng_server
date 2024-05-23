import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { VersionService } from './version.service';
import { FindVersionDto } from './dto/find-version.dto';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';

@Controller('version')
export class VersionController {
    constructor(private readonly versionService: VersionService) {}

    @Post()
    @UseGuards(AuthGuard, AdminGuard)
    async createVersion(@Body() dto: CreateVersionDto) {
        return await this.versionService.create(dto);
    }

    @Get()
    async findVersion(@Query() dto: FindVersionDto) {
        return await this.versionService.findVersion(dto);
    }

    @Patch()
    @UseGuards(AuthGuard, AdminGuard)
    async updateVersion(@Body() dto: UpdateVersionDto) {
        return await this.versionService.update(dto);
    }

    @Get('/health-check')
    async healthCheck() {
        return 'Health Check OK';
    }
}
