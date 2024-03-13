import { Controller, Get } from '@nestjs/common';

@Controller('slackTest')
export class SlacktestController {
    @Get('test')
    pulltestrequest() {
        return 'testtesttesttestt';
    }
}
