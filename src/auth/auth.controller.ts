import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from 'src/users/enum/roles.enum';
import { SignInDto, SignUpDto, ReissueTokensDto } from './dto/auth.dto';
import { TokensModel } from './model/auth.model';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signUp/:roles')
    signUp(@Param('roles') role: Roles, @Body() dto: SignUpDto): Promise<TokensModel> {
        return this.authService.signUpAndIssueTokens(role, dto);
    }

    @Post('signIn')
    signIn(@Body() dto: SignInDto): TokensModel {
        return this.authService.issueTokens(dto);
    }

    @Post('reissue')
    reissueTokens(@Body() dto: ReissueTokensDto): TokensModel {
        return this.authService.issueTokens(dto);
    }
}
