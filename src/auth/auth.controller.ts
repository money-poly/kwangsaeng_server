import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from 'src/users/enum/roles.enum';
import { SignInDto, SignUpDto, ReissueTokensDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { TransformInterceptor } from 'src/global/interceptor/transform.interceptor';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(TransformInterceptor)
    @Post('signUp/:role')
    sellerSignUp(@Param() role: Roles, @Body() dto: SignUpDto) {
        return this.authService.signUpAndIssueTokens(role, dto);
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
    reissueToken(@Body() dto: ReissueTokensDto) {
        return this.authService.issueTokens(dto);
    }
}
