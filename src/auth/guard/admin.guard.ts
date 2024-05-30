import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthException } from 'src/global/exception/auth-exception';
import { Roles } from 'src/users/enum/roles.enum';
import { UsersException } from 'src/global/exception/users-exception';
import { Seller } from 'src/users/entity/seller.entity';

interface RequestUser extends Request {
    user: Seller;
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
