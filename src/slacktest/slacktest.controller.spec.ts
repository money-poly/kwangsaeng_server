import { Test, TestingModule } from '@nestjs/testing';
import { SlacktestController } from './slacktest.controller';

describe('SlacktestController', () => {
  let controller: SlacktestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlacktestController],
    }).compile();

    controller = module.get<SlacktestController>(SlacktestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
