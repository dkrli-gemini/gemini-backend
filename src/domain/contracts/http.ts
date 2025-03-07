import { HttpStatus } from '@nestjs/common';

export interface IHttpResponse<T = any> {
  statusCode: number;
  message?: T;
  error?: Error;
  headers?: any[];
}

export const created = <T = any>(data: T): IHttpResponse => {
  return {
    statusCode: HttpStatus.CREATED,
    message: data,
  };
};
