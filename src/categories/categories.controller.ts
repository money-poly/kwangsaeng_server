import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { CreateSuperCategoryDto } from './dto/create-super-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post('super')
    async createSuperCategory(@Body() dto: CreateSuperCategoryDto) {
        return await this.categoriesService.createSuperCategory(dto);
    }

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
