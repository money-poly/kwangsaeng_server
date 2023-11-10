import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, RefeshAccessTokenDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { TransformInterceptor } from 'src/global/interceptor/transform.interceptor';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(TransformInterceptor)
    @Post('signUp')
    sellerSignUp(@Body() dto: SignUpDto) {
        return this.authService.signUpAndIssueTokens(dto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(TransformInterceptor)
    @Post('signIn')
    sellerSignIn(@Body() dto: SignInDto) {
        return this.authService.issueTokens(dto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(TransformInterceptor)
    @Post('reissue')
    reissueToken(@Body() dto: RefeshAccessTokenDto) {
        return this.authService.issueAccessToken(dto);
    }
}
