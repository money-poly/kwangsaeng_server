import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from 'src/users/enum/roles.enum';
import { TokensModel } from './model/auth.model';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ReissueTokensDto } from './dto/reissue-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signUp/:roles')
    signUp(@Param('roles') role: Roles, @Body() dto: SignUpDto): Promise<TokensModel> {
        return this.authService.signUpAndIssueTokens(role, dto);
    }

    @Post('signIn')
    signIn(@Body() dto: SignInDto): Promise<TokensModel> {
        return this.authService.issueTokens(dto);
    }

    @Post('reissue')
    reissueTokens(@Body() dto: ReissueTokensDto): Promise<TokensModel> {
        return this.authService.issueTokens(dto);
    }
}
