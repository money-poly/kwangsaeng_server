import { PickType } from '@nestjs/mapped-types';
import { CreateVersionDto } from './create-version.dto';

export class UpdateVersionDto extends PickType(CreateVersionDto, ['platform', 'version']) {}
