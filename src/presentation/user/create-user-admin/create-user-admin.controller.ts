import { Controller } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { CreateUserAdminInputDto } from './dtos/create-user-admin.input.dto';
import { CreateUserAdminOutputDto } from './dtos/create-user-admin.output.dto';

@Controller('create-user-admin')
export class CreateUserAdminController
  implements IController<CreateUserAdminInputDto, CreateUserAdminOutputDto>
{
  constructor(private readonly createUser:) {}
}
