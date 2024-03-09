import { Controller, Get } from '@nestjs/common';

@Controller('slacktest')
export class SlacktestController {
    @Get('test')
    pulltestrequest() {
        return 'hi hoiihihi';
    }
}
