import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { CacheModule } from 'src/cache/cache.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [CacheModule, HttpModule.register({})],
    providers: [SmsService],
    exports: [SmsService],
})
export class SmsModule {}
