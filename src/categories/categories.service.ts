import { Injectable } from '@nestjs/common';
import { Category } from 'src/categories/entity/category.entity';
import { FindOptionsWhere, TreeRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesException } from 'src/global/exception/categories-exception';
import { CreateSuperCategoryDto } from './dto/create-super-category.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { subNames, superNames } from './categories.constants';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: TreeRepository<Category>,
    ) {}

    async exist(where: FindOptionsWhere<Category>) {
        return await this.categoriesRepository.exist({
            where,
        });
    }

    async createSuperCategory(dto: CreateSuperCategoryDto) {
        const newSuperCategory = this.categoriesRepository.create(dto);

        return await this.categoriesRepository.save(newSuperCategory).catch((error) => {
            if (error.errno == 1062) {
                throw CategoriesException.ALREADY_EXIST_CATEGORY_NAME;
            }
        });
    }

    async createSubCategory(dto: CreateSubCategoryDto) {
        const superCategory = await this.categoriesRepository.findOne({
            where: {
                id: dto.superId,
            },
        });

        if (!superCategory) {
            throw CategoriesException.PARENT_NOT_FOUND;
        }

        const newChild = this.categoriesRepository.create({
            ...dto,
            super: superCategory,
        });

        return await this.categoriesRepository.save(newChild).catch((error) => {
            if (error.errno == 1062) {
                throw CategoriesException.ALREADY_EXIST_CATEGORY_NAME;
            }
        });
    }

    async findSupers() {
        return await this.categoriesRepository.findRoots();
    }

    async findSubs(superId: number) {
        const superCategory = await this.categoriesRepository.findOne({
            where: {
                id: superId,
            },
        });

        if (!superCategory) {
            throw CategoriesException.PARENT_NOT_FOUND;
        }

        return await this.categoriesRepository.findDescendantsTree(superCategory, {
            depth: 1,
        });
    }

    async initSuperCategories() {
        const exist = await this.exist({
            name: superNames[superNames.length - 1],
        });

        const supers: Category[] = [];

        if (!exist) {
            for (const name of superNames) {
                const superCategory = await this.categoriesRepository.save({
                    name,
                });

                supers.push(superCategory);
            }
        }

        return supers;
    }

    async initSubCategories(supers: Category[]) {
        const exist = await this.exist({
            name: subNames[subNames.length - 1],
        });

        if (!exist) {
            for (const name of subNames) {
                await this.categoriesRepository.save({
                    name,
                    super: supers[0],
                });
            }
        }
    }

    async initCategories() {
        const supers = await this.initSuperCategories();
        await this.initSubCategories(supers);
    }
}
