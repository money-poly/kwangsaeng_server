import { HttpStatus } from '@nestjs/common';
export class CommonException extends Error {
    readonly code: number;
    readonly status: number;

    constructor(code: number, message: string, status: number = HttpStatus.BAD_REQUEST) {
        super(message);
        this.code = code;
        this.status = status;
    }

    getStatus(): HttpStatus {
        return this.status;
    }
}
