import { MenusException } from 'src/global/exception/menus-exception';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { MenusService } from '../menus.service';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ModifyMenuValidationPipe implements PipeTransform {
    constructor(private readonly menusService: MenusService) {}

    async transform(dto: CreateMenuDto) {
        await this.validationName(dto.storeId, dto.name);

        return dto;
    }

    async validationName(id: number, name: string) {
        const exist = await this.menusService.exist({
            where: {
                name,
                store: {
                    id,
                },
            },
        });

        if (exist) {
            throw MenusException.ALREADY_EXIST_MENU_NAME;
        }
    }
}
