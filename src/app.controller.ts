import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guard/auth.guard';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private logger: Logger,
    ) {}

    // @UseGuards(AuthGuard)
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
