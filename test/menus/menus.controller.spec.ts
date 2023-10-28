import { Test, TestingModule } from '@nestjs/testing';
import { MenusController } from '../../src/menus/menus.controller';
import { MenusService } from '../../src/menus/menus.service';

describe('MenusController', () => {
    let controller: MenusController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MenusController],
            providers: [MenusService],
        }).compile();

        controller = module.get<MenusController>(MenusController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
