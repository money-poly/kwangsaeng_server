import { Controller, Get } from '@nestjs/common';

@Controller('log-test')
export class LogTestController {
    @Get('test')
    pulltestrequest() {
        return '최종 테스트';
    }
}
