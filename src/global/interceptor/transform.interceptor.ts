import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { messageKey } from '../decorator/message-key.decorator';
export interface Info {
    success: true;
    message: string;
}
export type Response<T> = Info & {
    data: T;
};
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<Text, Response<T>> {
    constructor(private readonly reflector: Reflector) {}

    intercept(ctx: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const status = ctx.switchToHttp().getResponse().statusCode;
        const message = this.reflector?.get<string>(messageKey, ctx.getHandler());
        return next.handle().pipe(
            map((data) => ({
                success: true,
                statusCode: status,
                message,
                data,
            })),
        );
    }
}
