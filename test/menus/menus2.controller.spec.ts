import { Test, TestingModule } from '@nestjs/testing';
import { Menus2Controller } from '../../src/menus2.0/menus2.controller';

describe('Menus2Controller', () => {
    let controller: Menus2Controller;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [Menus2Controller],
        }).compile();

        controller = module.get<Menus2Controller>(Menus2Controller);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
