import { PickType } from '@nestjs/mapped-types';
import { FindAsLocationDto } from './find-as-loaction.dto';

export class FindOneMenuDetailDto extends PickType(FindAsLocationDto, ['lat', 'lon']) {}
