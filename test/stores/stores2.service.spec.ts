import { Test, TestingModule } from '@nestjs/testing';
import { Stores2Service } from '../../src/stores2.0/stores2.service';

describe('Stores2Service', () => {
    let service: Stores2Service;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Stores2Service],
        }).compile();

        service = module.get<Stores2Service>(Stores2Service);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
