import { Test, TestingModule } from '@nestjs/testing';
import { Menus2Service } from '../../src/menus2.0/menus2.service';

describe('Menus2Service', () => {
    let service: Menus2Service;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Menus2Service],
        }).compile();

        service = module.get<Menus2Service>(Menus2Service);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
