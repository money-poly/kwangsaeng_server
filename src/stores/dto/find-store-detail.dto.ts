import { PickType } from '@nestjs/mapped-types';
import { FindStoreWithLocationDto } from './find-store-with-location.dto';

export class FindStoreDetailDto extends PickType(FindStoreWithLocationDto, ['lat', 'lon']) {}
