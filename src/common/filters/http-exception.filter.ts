import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { errorResponse } from '../utils/response.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const httpAdapter = this.adapterHost.httpAdapter;
    const response: unknown = host.switchToHttp().getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: unknown = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (res !== null && typeof res === 'object') {
        const responseData = res as Record<string, unknown>;
        message = (responseData.message as string) || exception.message;
        errors = responseData.error || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      // You can add more specific error handling here (e.g., Prisma errors)
    }

    // Logging the error
    this.logger.error(
      `${status} - ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    httpAdapter.reply(response, errorResponse(status, message, errors), status);
  }
}
