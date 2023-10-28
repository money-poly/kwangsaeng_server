import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from '../../src/stores/stores.controller';
import { StoresService } from '../../src/stores/stores.service';

describe('StoresController', () => {
    let controller: StoresController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StoresController],
            providers: [StoresService],
        }).compile();

        controller = module.get<StoresController>(StoresController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
