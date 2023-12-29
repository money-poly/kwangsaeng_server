import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import twilioConfiguration from 'src/global/config/twilio.configuration';
import { TwilioService } from 'nestjs-twilio';
import { SmsException } from 'src/global/exception/sms-exception';
import { SendVerifiactionCodeDto } from 'src/auth/dto/send-verification-code.dto';
import { VerifyCodeDto } from 'src/auth/dto/verify-code.dto';

@Injectable()
export class SmsService {
    constructor(
        private readonly twilioService: TwilioService,
        @Inject(twilioConfiguration.KEY)
        private twilioConfig: ConfigType<typeof twilioConfiguration>,
    ) {}

    async sendVerificationCode(dto: SendVerifiactionCodeDto): Promise<void> {
        const to = '+82' + dto.to.replace(/^0/, '');

        try {
            await this.twilioService.client.verify.v2
                .services(this.twilioConfig.verifyServiceSid)
                .verifications.create({
                    to,
                    channel: 'sms',
                });
        } catch (error) {
            if (error.code == 21608) {
                throw SmsException.INVALID_PHONE_NUMBER;
            } else {
                console.log('error :>> ', error);
            }
        }
    }

    async checkVerificationCode(dto: VerifyCodeDto) {
        const to = '+82' + dto.to.replace(/^0/, '');

        try {
            const verify = await this.twilioService.client.verify.v2
                .services(this.twilioConfig.verifyServiceSid)
                .verificationChecks.create({
                    to,
                    code: dto.code,
                });

            if (verify.valid) {
                return {
                    verify: true,
                };
            } else {
                return {
                    verify: false,
                };
            }
        } catch (error) {
            if (error.code == 20404) {
                throw SmsException.NOT_FOUND;
            } else {
                console.log('error :>> ', error);
            }
        }
    }
}
