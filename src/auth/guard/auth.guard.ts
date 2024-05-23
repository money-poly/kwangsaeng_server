import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthException } from 'src/global/exception/auth-exception';
import { Seller } from 'src/users/entity/seller.entity';

interface RequestUser extends Request {
    user: Seller;
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
            } as Seller;
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private validateToken(token: string) {
        const secretKey = process.env.JWT_ACCESS_SECRET;

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
