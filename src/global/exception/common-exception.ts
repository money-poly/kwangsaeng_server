import { HttpException, HttpExceptionOptions, HttpStatus } from '@nestjs/common';

export class CommonException extends HttpException {
    readonly code: number;

    constructor(
        message: string,
        code: number,
        status: number = HttpStatus.BAD_REQUEST,
        options?: HttpExceptionOptions,
    ) {
        super(message, status, options);
        this.code = code;
    }

    getStatus(): HttpStatus {
        return super.getStatus();
    }
}
