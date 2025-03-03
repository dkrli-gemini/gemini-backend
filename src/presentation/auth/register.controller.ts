import { Controller } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse } from 'src/domain/contracts/http';
import { BearerTokenDto } from './bearer-token.dto';

export type RegisterOutputDto = BearerTokenDto;

@Controller('auth')
export class RegisterController
  implements IController<null, RegisterOutputDto>
{
  handle(input: null): Promise<IHttpResponse<BearerTokenDto | Error>> {
    throw new Error('Method not implemented.');
  }
}
