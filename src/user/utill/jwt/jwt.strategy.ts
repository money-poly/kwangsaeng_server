import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt } from "passport-jwt";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'resource/db/entities/User';
import { Repository } from 'typeorm';
import { ErrorResponse } from 'resource/response/error-reponse';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private errorResponse: ErrorResponse
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload) {
    const { userIdx } = payload;
    const user = await this.userRepo.findOne(userIdx);
    
    if (!user) this.errorResponse.notAuthorizationLogin();

    return user;
  }
}