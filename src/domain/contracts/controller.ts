import { IHttpResponse } from './http';
import { Request } from 'express';

export interface IController<InputDto, OutputDto> {
  handle(
    input: InputDto,
    req: Request,
  ): Promise<IHttpResponse<OutputDto | Error>>;
}
