import { Test, TestingModule } from '@nestjs/testing';
import { LogTestController } from './log-test.controller';
import { LogTestService } from './log-test.service';

describe('LogTestController', () => {
  let controller: LogTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogTestController],
      providers: [LogTestService],
    }).compile();

    controller = module.get<LogTestController>(LogTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
