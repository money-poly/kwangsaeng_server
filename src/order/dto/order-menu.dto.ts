import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsInt()
    menuId: number;

    @IsInt()
    quantity: number;
}

export class OrderMenuDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orders: OrderItemDto[];
}
