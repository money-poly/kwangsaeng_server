import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Store } from 'src/stores/entity/store.entity';
import { StoresRepository } from 'src/stores/stores.repository';
import { EntityTransformerKey, EntityTransformerOptions } from '../decorator/transform-with-relations.decorator';
import { FindOptionsRelations } from 'typeorm';
import { StoresException } from '../exception/stores-exception';
import { map } from 'rxjs';

interface RequestStore extends Request {
    params: {
        storeId: string;
    };
    store: Store;
}

@Injectable()
export class TransformStoreInterceptor implements NestInterceptor {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly reflector: Reflector,
    ) {}

    async intercept(ctx: ExecutionContext, next: CallHandler) {
        const req: RequestStore = ctx.switchToHttp().getRequest();
        const id = parseInt(req.params?.storeId);

        const meta = this.reflector.get<EntityTransformerOptions<Store>>(EntityTransformerKey, ctx.getHandler());
        let store = null;

        store = await this.toEntity(id, meta?.loadEntityOptions?.relations);

        req.store = store;

        if (meta?.response?.excludeProperties) {
            return next.handle().pipe(
                map((data) => {
                    const transformedData = this.serialize(data, meta.response.excludeProperties);
                    return transformedData;
                }),
            );
        } else {
            return next.handle();
        }
    }

    serialize(store: Store, exclude: string[] = null): Partial<Store> {
        const storeCopy = JSON.parse(JSON.stringify(store));

        if (!exclude) {
            return;
        }

        exclude.forEach((prop) => {
            const props = prop.split('.');
            let temp = storeCopy;

            for (let i = 0; i < props.length - 1; i++) {
                temp = temp[props[i]];
                if (!temp) break;
            }

            if (temp && temp.hasOwnProperty(props[props.length - 1])) {
                delete temp[props[props.length - 1]];
            }
        });

        return storeCopy;
    }

    async toEntity(id: number, relations: FindOptionsRelations<Store> = {}) {
        const store = await this.storesRepository.findOneStore(
            {
                id,
            },
            {},
            relations,
        );

        if (!store) {
            throw StoresException.ENTITY_NOT_FOUND;
        }

        return store;
    }
}
