import { Test, TestingModule } from '@nestjs/testing';
import { LogTestService } from './log-test.service';

describe('LogTestService', () => {
  let service: LogTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogTestService],
    }).compile();

    service = module.get<LogTestService>(LogTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
