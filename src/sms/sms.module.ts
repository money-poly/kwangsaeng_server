import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { TwilioModule } from 'nestjs-twilio';
import twilioConfiguration from 'src/global/config/twilio.configuration';
import { ConfigModule, ConfigType } from '@nestjs/config';

@Module({
    imports: [
        TwilioModule.forRootAsync({
            imports: [ConfigModule],
            inject: [twilioConfiguration.KEY],
            useFactory: (config: ConfigType<typeof twilioConfiguration>) => ({
                accountSid: config.sid,
                authToken: config.authToken,
            }),
        }),
    ],
    providers: [SmsService],
    exports: [SmsService],
})
export class SmsModule {}
