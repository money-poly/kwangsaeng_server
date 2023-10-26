import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform {
  transform(value: number) {
    if (value <= 0) {
      throw new BadRequestException({
        statusCode: 3001,
        message: '값이 0보다 커야 합니다.',
        result: { fcmTokens: {} },
      });
    }
    return value;
  }
}
