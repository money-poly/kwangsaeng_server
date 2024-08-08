import { Transform, Type } from 'class-transformer';
import {
    isEnum,
    IsEnum,
    IsInt,
    IsLatitude,
    IsLongitude,
    IsOptional,
    IsString,
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';
import { MenuCategories } from 'src/menus2.0/enum/categories.enum';
import { SortFilterType } from 'src/menus2.0/enum/sort-filter-type.enum';

function toString(value: number | string): string {
    return String(value);
}

function IsEnumOrString(enumType: object, allowedString: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsEnumOrString',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [enumType, allowedString],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [enumType, allowedString] = args.constraints;
                    return isEnum(value, enumType) || value === allowedString;
                },
                defaultMessage(args: ValidationArguments) {
                    const allowedString = args.constraints[1];
                    return `$property must be either a valid enum value or the string '${allowedString}'`;
                },
            },
        });
    };
}

export class TopOrdersDto {
    @IsEnum(SortFilterType)
    type: SortFilterType;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    lastId?: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => toString(value))
    lastValue?: string;

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lon: number;

    @IsEnumOrString(MenuCategories, 'all')
    category: MenuCategories | 'all';
}
