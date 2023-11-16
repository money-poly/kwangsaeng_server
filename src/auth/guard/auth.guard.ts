import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../config/jwtConstants';
import { User } from 'src/users/entity/user.entity';
import { AuthException } from 'src/global/exception/auth-exception';

interface RequestUser extends Request {
    user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: RequestUser = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw AuthException.IS_EMPTY_TOKEN;
        } else {
            const payload = this.validateToken(token);
            request.user = {
                ...payload,
            } as User;
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private validateToken(token: string) {
        const secretKey = jwtConstants.ACCESS_SECRET;

        try {
            const verify = this.jwtService.verify(token, { secret: secretKey });
            return verify;
        } catch (e) {
            switch (e.name) {
                case 'JsonWebTokenError':
                    throw AuthException.NOT_VALID_TOKEN;

                case 'TokenExpiredError':
                    throw AuthException.IS_EXPIRED_TOKEN;

                case 'NotBeforeError':
                    throw AuthException.NOT_BEFORE_TOKEN;

                default:
                    throw AuthException.DEFAULT_TOKEN_ERROR;
            }
        }
    }
}
