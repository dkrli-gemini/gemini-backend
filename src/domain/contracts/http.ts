export interface IHttpResponse<T = any> {
  statusCode: number;
  message?: T;
  error?: Error;
  headers?: any[];
}
