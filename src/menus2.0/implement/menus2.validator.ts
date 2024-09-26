import { Injectable } from '@nestjs/common';
import { Menus2Repository } from '../menus2.repository';
import { Menus2Reader } from './menus2.reader';
import { Seller } from 'src/users/entity/seller.entity';
import { Store } from 'src/stores/entity/store.entity';
import { MenusException } from 'src/global/exception/menus-exception';
import { Roles } from 'src/users/enum/roles.enum';

@Injectable()
export class Menus2Validator {
    constructor(
        private readonly menusRepository: Menus2Repository,
        private readonly menusReader: Menus2Reader,
    ) {}

    checkCreatePermission(user: Seller, store: Store) {
        if (user.id !== store.user.id || user.role !== Roles.OWNER) {
            throw MenusException.HAS_NO_PERMISSION_CREATE;
        }
    }
}
