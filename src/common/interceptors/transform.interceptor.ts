import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse, successResponse } from '../utils/response.util';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponse<T>
> {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const response: unknown = context.switchToHttp().getResponse();
    const statusCode = this.getStatusCode(response);

    return next.handle().pipe(
      map((data: unknown) => {
        // If the data is already in successResponse format, return it as is
        if (this.isSuccessResponse<T>(data)) {
          return data;
        }

        return successResponse(statusCode, 'Success', data as T);
      }),
    );
  }

  private getStatusCode(response: unknown): number {
    if (
      response !== null &&
      typeof response === 'object' &&
      'statusCode' in response &&
      typeof response.statusCode === 'number'
    ) {
      return response.statusCode;
    }
    return HttpStatus.OK;
  }

  private isSuccessResponse<T>(data: unknown): data is SuccessResponse<T> {
    return (
      data !== null &&
      typeof data === 'object' &&
      'success' in data &&
      'responseCode' in data
    );
  }
}
