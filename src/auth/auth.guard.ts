import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
// import { jwtConstants } from './constants';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            // 💡 See this condition
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            // throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
        } else {
            this.validateToken(token);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private validateToken(token: string) {
        const secretKey = process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : 'dev';

        try {
            const verify = this.jwtService.verify(token, { secret: secretKey });
            return verify;
        } catch (e) {
            switch (e.message) {
                // 토큰에 대한 오류를 판단합니다.
                case 'INVALID_TOKEN':
                case 'TOKEN_IS_ARRAY':
                case 'NO_USER':
                // throw new HttpException('유효하지 않은 토큰입니다.', 401);

                case 'EXPIRED_TOKEN':
                // throw new HttpException('토큰이 만료되었습니다.', 410);

                default:
                // throw new HttpException('서버 오류입니다.', 500);
            }
        }
    }
}
