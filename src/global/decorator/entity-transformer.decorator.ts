import { NestInterceptor, Type, UseInterceptors, applyDecorators } from '@nestjs/common';
import { EntityTransformer, EntityTransformerOptions } from './transform-with-relations.decorator';

export function UseEntityTransformer<T>(interceptor: Type<NestInterceptor>, options?: EntityTransformerOptions<T>) {
    return applyDecorators(UseInterceptors(interceptor), EntityTransformer(options));
}
