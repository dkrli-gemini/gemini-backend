import { IHttpResponse } from './http';

export interface IController<InputDto, OutputDto> {
  handle(input: InputDto): Promise<IHttpResponse<OutputDto | Error>>;
}
