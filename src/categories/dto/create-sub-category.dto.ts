import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateSuperCategoryDto } from './create-super-category.dto';

export class CreateSubCategoryDto extends PickType(CreateSuperCategoryDto, ['name', 'description']) {
    @IsNotEmpty()
    @IsNumber()
    superId: number;
}
