import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from '../../src/stores/stores.controller';
import { StoresService } from '../../src/stores/stores.service';
import { mockStores } from 'src/global/common/mock.constant';
import { Store } from 'src/stores/entity/store.entity';

describe('StoresController', () => {
    let controller: StoresController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StoresController],
            providers: [
                {
                    provide: StoresService,
                    useValue: {
                        findOneStore: jest.fn().mockResolvedValue(mockStores),
                    },
                },
            ],
        }).compile();

        controller = module.get<StoresController>(StoresController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('가게 상세 페이지', async () => {});
});
