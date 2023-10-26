import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Oauth20 } from './utill/oauth20';

@Module({
  controllers: [UserController],
  providers: [UserService, Oauth20],
})
export class UserModule {}
