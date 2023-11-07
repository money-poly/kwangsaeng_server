import { Body, Controller, Post, Query, Req, Logger, Get } from '@nestjs/common';
import { UserCreateDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly logger: Logger,
    ) {}

    @Post()
    async createSeller(@Req() req: any, @Body() dto: UserCreateDto) {
        return this.usersService.createSeller(dto);
    }
}
