import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const statusCode = exception.getStatus();
    const background = 'error';

    let response: { message: string, statusCode: number, background: string; };

    if (exception.response.message instanceof Array) {
      response = { message: exception.response.message[0], statusCode, background };
    } else if (exception.response.message instanceof Object) {
      response = { message: exception.response.message, statusCode, background };
    } else {
      response = { message: exception.response, statusCode, background };
    }

    res.status(statusCode).json(response);
  }
}