@Controller('log-test')
export class LogTestController {
    @Get('test')
    pulltestrequest() {
        return 'hi hoiihihi';
    }
}
