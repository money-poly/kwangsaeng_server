import { CategoriesService } from './categories/categories.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { StoresService } from './stores/stores.service';

@Injectable()
export class InitializeService implements OnModuleInit {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly storesService: StoresService,
    ) {}

    async onModuleInit() {
        await this.categoriesService.initCategories();
        await this.storesService.initMockStores();
        //await this.storesService.migrateDynamo();
    }
}
