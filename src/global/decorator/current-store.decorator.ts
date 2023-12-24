import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentStore = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.store;
});
