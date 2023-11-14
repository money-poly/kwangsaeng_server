import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { CommonException } from '../exception/common-exception';

@Catch(CommonException)
export class CommonExceptionFilter implements ExceptionFilter {
    catch(exception: CommonException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus();

        response.status(status).json({
            code: exception.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
