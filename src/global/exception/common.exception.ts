import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class CommonException extends Error {
    readonly code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}

@Catch(CommonException)
export class CommonExceptionFilter implements ExceptionFilter {
    catch(exception: CommonException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const resp = ctx.getResponse<Response>();

        resp.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: exception.code,
            message: exception.message,
        });
    }
}
