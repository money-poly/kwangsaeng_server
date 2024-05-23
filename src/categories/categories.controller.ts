import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateSubCategoryDto } from 'src/categories/dto/create-sub-category.dto';
import { CreateSuperCategoryDto } from 'src/categories/dto/create-super-category.dto';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @UseGuards(AuthGuard, AdminGuard)
    @Post('super')
    async createSuperCategory(@Body() dto: CreateSuperCategoryDto) {
        return await this.categoriesService.createSuperCategory(dto);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Post('sub')
    async createSubCategory(@Body() dto: CreateSubCategoryDto) {
        return await this.categoriesService.createSubCategory(dto);
    }

    @Get()
    async findSupers() {
        return await this.categoriesService.findSupers();
    }

    @Get('/sub/:superId')
    async findSubs(@Param('superId') superId: number) {
        return await this.categoriesService.findSubs(superId);
    }
}
