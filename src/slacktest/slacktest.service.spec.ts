import { Test, TestingModule } from '@nestjs/testing';
import { SlacktestService } from './slacktest.service';

describe('SlacktestService', () => {
  let service: SlacktestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlacktestService],
    }).compile();

    service = module.get<SlacktestService>(SlacktestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
