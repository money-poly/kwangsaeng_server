import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsString } from 'class-validator';
import { Roles } from '../enum/roles.enum';

export class UpdateUserRoleDto extends PickType(CreateUserDto, ['uid'] as const) {
    @IsEnum(Roles)
    @IsString()
    role: Roles;
}
