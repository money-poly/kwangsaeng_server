import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const curr = new Date();
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
    const KR_TIME_DIFF = 18 * 60 * 60 * 1000;
    const kr_curr = new Date(utc + KR_TIME_DIFF);

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        if (response.statusCode === HttpStatus.OK || response.statusCode === HttpStatus.CREATED) {
          return {
            isSuccess: true,
            code: 1000,
            message: '요청에 성공했습니다.',
            result: data,
          };
        } else {
          return { isSuccess: false, code: HttpStatus.UNAUTHORIZED, kr_curr };
        }
      }),
    );
  }
}
