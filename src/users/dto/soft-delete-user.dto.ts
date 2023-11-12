import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class SoftDeleteUserDto extends PickType(CreateUserDto, ['uid'] as const) {}
