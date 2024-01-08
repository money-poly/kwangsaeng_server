import { Test, TestingModule } from '@nestjs/testing';
import { BannersService } from 'src/banners/banners.service';

describe('BannersService', () => {
    let service: BannersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BannersService],
        }).compile();

        service = module.get<BannersService>(BannersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
