import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from 'src/users/enum/roles.enum';
import { TokensModel } from './model/auth.model';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ReissueTokensDto } from './dto/reissue-token.dto';
import { SmsService } from 'src/sms/sms.service';
import { SendVerifiactionCodeDto } from './dto/send-verification-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly smsService: SmsService,
    ) {}

    @Post('register/:roles')
    signUp(@Param('roles') role: Roles, @Body() dto: SignUpDto): Promise<TokensModel> {
        return this.authService.signUpAndIssueTokens(role, dto);
    }

    @Post('login')
    signIn(@Body() dto: SignInDto): Promise<TokensModel> {
        return this.authService.issueTokens(dto);
    }

    @Post('reissue')
    reissueTokens(@Body() dto: ReissueTokensDto): Promise<TokensModel> {
        return this.authService.issueTokens(dto);
    }

    @Throttle({ default: { limit: 2, ttl: 25000 } })
    @Post('verification/send')
    sendVerificationCode(@Body() dto: SendVerifiactionCodeDto) {
        return this.smsService.sendVerificationCode(dto);
    }

    @Post('verification/verify')
    verifyCode(@Body() dto: VerifyCodeDto) {
        return this.smsService.checkVerificationCode(dto);
    }
}
