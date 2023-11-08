import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SellerLoginDto } from './dto/auth.dto';
// import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    seller(@Body() dto: SellerLoginDto) {
        return this.authService.signUpOrIn(dto);
    }
}
