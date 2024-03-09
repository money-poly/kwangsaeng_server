import { Module } from '@nestjs/common';
import { SlacktestController } from './slacktest.controller';
import { SlacktestService } from './slacktest.service';

@Module({
  controllers: [SlacktestController],
  providers: [SlacktestService]
})
export class SlacktestModule {}
