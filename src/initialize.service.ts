import { CategoriesService } from './categories/categories.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { StoresService } from './stores/stores.service';
import { MenusService } from './menus/menus.service';
import { TagsService } from './tags/tags.service';

@Injectable()
export class InitializeService implements OnModuleInit {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly storesService: StoresService,
        private readonly menusService: MenusService,
        private readonly tagsService: TagsService,
    ) {}

    async onModuleInit() {
        await this.categoriesService.initCategories();
        await this.tagsService.initTags();
        await this.storesService.initMockStores();
        await this.menusService.initMockMenus();
        // await this.storesService.migrateDynamo();
    }
}
