import { MenusException } from 'src/global/exception/menus-exception';

import { MenusService } from '../menus.service';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformMenuPipe implements PipeTransform {
    constructor(private readonly menusService: MenusService) {}

    async transform(value: number) {
        const menu = await this.menusService.findOne(
            {
                id: value,
            },
            {},
            { store: true },
        );

        if (!menu) {
            throw MenusException.ENTITY_NOT_FOUND;
        }
        return menu;
    }
}
