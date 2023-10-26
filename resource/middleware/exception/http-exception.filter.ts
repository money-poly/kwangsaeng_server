import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    //const status = exception.getStatus();
    const status = 200; // 주송님이 200으로 통일 요청하심
    const errorResponse = exception.getResponse() as string | Record<string, any>;

    let message = '';
    let code = exception.getStatus();
    let result = {};

    if (typeof errorResponse === 'object') {
      if (errorResponse.statusCode) code = errorResponse.statusCode;
      if (Array.isArray(errorResponse.message)) {
        message = errorResponse.message[0];
      }
      if (typeof errorResponse.message === 'string') message = errorResponse.message;
      if (errorResponse.result) result = errorResponse.result;
    }

    response.status(status).json({
      isSuccess: false,
      code,
      message,
      result,
    });
  }
}
