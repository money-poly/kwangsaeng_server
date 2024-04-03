import { Controller, Get } from '@nestjs/common';

@Controller('log-test')
export class LogTestController {
    @Get('test')
    pulltestrequest() {
        return 'GET 테스트 로깅 알람 제거';
    }
}
