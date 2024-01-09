import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/users/entity/user.entity';
import { AuthException } from 'src/global/exception/auth-exception';
import { Roles } from 'src/users/enum/roles.enum';
import { UsersException } from 'src/global/exception/users-exception';

interface RequestUser extends Request {
    user: User;
}

@Injectable()
export class AdminGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: RequestUser = context.switchToHttp().getRequest();
        if (!request.user) {
            throw UsersException.NOT_EXIST_USER;
        }

        const role = request.user.role;
        if (role !== Roles.ADMIN) {
            throw AuthException.DENINED_USER_NOT_ADMIN;
        }
        return true;
    }
}
