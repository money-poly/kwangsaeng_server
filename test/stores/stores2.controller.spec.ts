import { Test, TestingModule } from '@nestjs/testing';
import { Stores2Controller } from '../../src/stores2.0/stores2.controller';

describe('Stores2Controller', () => {
    let controller: Stores2Controller;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [Stores2Controller],
        }).compile();

        controller = module.get<Stores2Controller>(Stores2Controller);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
