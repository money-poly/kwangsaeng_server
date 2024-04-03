import { Controller, Get } from '@nestjs/common';

@Controller('log-test')
export class LogTestController {
    @Get('test')
    pulltestrequest() {
        return 'GET test2222';
    }
}
