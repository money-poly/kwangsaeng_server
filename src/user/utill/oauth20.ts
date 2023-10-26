import { ErrorResponse } from "resource/response/error-reponse";
import { TokenDto } from "../dto/token.dto";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "resource/db/entities/User";
import { Token } from "resource/db/entities/Token";

@Injectable()
export class Oauth20 {
  private fireUid_: String;
  private token_ = new TokenDto;
  private loginType_: String;
  private userIdx_: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    private readonly errorResponse: ErrorResponse,
    private readonly jwtService: JwtService
  ){} 

  public initialize(fireUid: String, loginType: String) {
    this.fireUid_ = fireUid;
    this.loginType_ = loginType;
  }
  
  public async checkSignUpOrIn(): String {
    const fireUid = this.fireUid_;
    const user = await this.tokenRepo.findOne({
      where : { fireUid }
    });
    return user ? "signIn" : "signUp";
  }

  private async generateJWT(){
    const user = await this.tokenRepo.getByEmail(this.fireUid_);

    this.userIdx_ = user.userIdx;
    const payload = { userIdx: this.userIdx_ };

    this.getAccessToken(payload, this.token_);
    this.getRefreshToken(payload, this.token_);

    return this.token_;
  }

  public async insert(){
    if(this.generateJWT()){
      return await this.tokenRepo.save(this.token_);
    }
  }

  public async update(){
    this.generateJWT();
    return await this.tokenRepo.update(this.token_.access, )// 그냥 엔티티 받아서 바로 처리. 따로 커스텀하지말고.
  }

  public getAllNewToken(): TokenDto{
    return this.token_;
  }

  public getAccessToken(payload, dto : TokenDto): void {
    dto.access = this.jwtService.sign(payload, {
      secret : process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn : process.env.JWT_ACCESS_TOKEN_EXPIRED_TIME
    }) 
    const currentTime = new Date().toLocaleString(); 
    dto.accessExpired = currentTime + JWT_ACCESS_TOKEN_EXPIRED_TIME;
  }

  private getRefreshToken(payload, dto: TokenDto): void {
    dto.refresh = this.jwtService.sign(payload, {
      secret : process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn : process.env.JWT_REFRESH_TOKEN_EXPIRED_TIME
    })
    const currentTime = new Date().toLocaleString(); 
    dto.refreshExpired = currentTime + JWT_REFRESH_TOKEN_EXPIRED_TIMEE;
  }
}