import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './config/secretkey';
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
            throw new HttpException('Token is empty', HttpStatus.UNAUTHORIZED);
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
        const secretKey = jwtConstants.secret;

        try {
            const verify = this.jwtService.verify(token, { secret: secretKey });
            return verify;
        } catch (e) {
            switch (e.name) {
                case 'JsonWebTokenError':
                    throw new HttpException('JWT 오류: 유효하지 않은 토큰입니다.', 401);

                case 'TokenExpiredError':
                    throw new HttpException('JWT 오류: 토큰이 만료되었습니다.', 410);

                case 'NotBeforeError':
                    throw new HttpException('JWT 오류: 아직 활성화되지 않은 토큰입니다.', 403);

                default:
                    throw new HttpException('JWT 검증 중에 오류가 발생했습니다.', 500);
            }
        }
    }
}
