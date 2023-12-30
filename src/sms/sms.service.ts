import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { SendVerifiactionCodeDto } from 'src/auth/dto/send-verification-code.dto';
import { VerifyCodeDto } from 'src/auth/dto/verify-code.dto';
import { CacheService } from 'src/cache/cache.service';
import aligoConfiguration from 'src/global/config/aligo.configuration';
import { SmsException } from 'src/global/exception/sms-exception';

@Injectable()
export class SmsService {
    private reqConfig: AxiosRequestConfig = {
        baseURL: 'https://apis.aligo.in',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    constructor(
        @Inject(aligoConfiguration.KEY)
        private aligoConfig: ConfigType<typeof aligoConfiguration>,
        private readonly httpService: HttpService,
        private readonly cacheService: CacheService,
    ) {}

    async sendVerificationCode(dto: SendVerifiactionCodeDto): Promise<void> {
        await this.checkRemain();

        const otp = this.generateOtp(6);
        await this.cachingOtp(dto.to, otp);

        await firstValueFrom(
            this.httpService
                .post(
                    '/send/',
                    {
                        key: this.aligoConfig.apiKey,
                        user_id: this.aligoConfig.userId,
                        msg_type: 'SMS',
                        msg: `[광생] 인증번호는 ${otp} 입니다.`,
                        receiver: dto.to,
                    },
                    this.reqConfig,
                )
                .pipe(),
        );
    }

    async cachingOtp(phone: string, otp: string) {
        await this.cacheService.set(phone + ':otp', otp, 180000);
    }

    generateOtp(length: number) {
        let str = '';

        for (let i = 0; i < length; i++) {
            str += Math.floor(Math.random() * 10);
        }

        return str;
    }

    async checkRemain() {
        const { data } = await firstValueFrom(
            this.httpService.post(
                '/remain/',
                {
                    key: this.aligoConfig.apiKey,
                    user_id: this.aligoConfig.userId,
                },
                this.reqConfig,
            ),
        );

        if (data.SMS_CNT <= 0) {
            throw SmsException.NO_REMAIN;
        }

        return data;
    }

    async checkVerificationCode(dto: VerifyCodeDto) {
        const otp = await this.cacheService.get(dto.to + ':otp');

        if (!otp) {
            throw SmsException.NOT_FOUND;
        }

        if (otp == dto.code) {
            await this.cacheService.del(dto.to);
            return { verified: true };
        } else {
            return { verified: false };
        }
    }
}
