import { ApplicationError } from './aplication.error';

export class InvalidParamError extends ApplicationError {
  constructor(paramName: string) {
    super(`Invalid param [${paramName}]`);
    this.name = InvalidParamError.name;
  }
}
