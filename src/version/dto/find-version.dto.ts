import { PickType } from '@nestjs/mapped-types';
import { CreateVersionDto } from './create-version.dto';

export class FindVersionDto extends PickType(CreateVersionDto, ['platform']) {}
