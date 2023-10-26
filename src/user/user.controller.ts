import { Body, Controller, Param, Patch, Post, UseFilters, UseInterceptors } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { response } from 'express';
import { TokenDto } from './dto/token.dto';
import { SocialUserDto } from './dto/social-user.dto';
import { SuccessInterceptor } from 'resource/middleware/interceptor/success.interceptor';
import { HttpExceptionFilter } from 'resource/middleware/exception/http-exception.filter';

/**
 * 기능 : 수신, 송신 시 유효성 검사
 * 함수명 : API 목적을 포괄하는 제목
 * 형태 : 명사 or 동사+명사
 * 파라미터 : DTO 통쨰로 넘기기
 */

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @UseInterceptors(SuccessInterceptor)
  @UseFilters(HttpExceptionFilter)
  @Post()
  async oauth20(@Body() dto: SocialUserDto, @Param('loginType') loginType: string): Promise<any> {
    const response = await this.userService.getAllNewJWT(dto, loginType);
    return response;
  }

  @UseInterceptors(SuccessInterceptor)
  @UseFilters(HttpExceptionFilter)
  @Post('v1/reissue')
  async reIssueAccessToken(@Body() dto: SocialUserDto) {
    return await this.userService.getNewAT(dto);
  }

  @UseInterceptors(SuccessInterceptor)
  @UseFilters(HttpExceptionFilter)
  @Patch('v1/profile')
  async updateProfile(@Body() dto: SocialUserDto) {
    return await this.userService.updateProfileById(dto);
  }
}
