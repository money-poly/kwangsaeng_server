import { Injectable } from '@nestjs/common';
import { Repository, Timestamp } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Oauth20 } from './utill/oauth20';
import { SocialUserDto } from './dto/social-user.dto';
import { TokenDto } from './dto/token.dto';
import { Token } from 'resource/db/entities/Token';
import { User } from 'resource/db/entities/User';

/**
 * 기능 : 함수명 호출 순서로 로직이 보이도록 / 간단한 CRUD는 바로 호출. / 주입 객체의 interface 활용
 * 함수명 : response로 리턴할 내용 명시
 * 파라미터 : DTO parsing
 */

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    private readonly oauth20: Oauth20
  ) {}

  async getAllNewJWT(dto: SocialUserDto, loginType): Promise<any> {
    this.oauth20.initialize(dto.fireUid, loginType); 
    const mode = this.oauth20.checkSignUpOrIn();

    switch (mode) {
      case "signUp":
        if(isOk = await this.oauth20.insert()) // if 안걸어도 되나?
          return this.oauth20.getAllNewToken();
        
      case "signIn":
        return this.oauth20.getAllNewToken();
    }
  }

  async getNewAT(dto: SocialUserDto): TokenDto {
    const token = new TokenDto;

    const user = await this.tokenRepo.getByEmail(this.fireUid_);
    const payload = { userIdx: user.userIdx_ };

    const accessToken = this.oauth20.getAccessToken(payload, token);
    token.access = accessToken;
    return 
  }

  async updateProfileById(dto: SocialUserDto): Promise<any> {
    await this.userRepo.updateById(fireUid: String, nickname: String, age: Number);
  }
}
