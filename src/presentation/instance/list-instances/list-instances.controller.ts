import { Controller, Get } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { IInstanceRepository } from 'src/domain/repository/instance.repository';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { ListInstancesOutputDto } from './dtos/list-instances.output.dto';

@Controller('instances')
export class ListInstancesController
  implements IController<void, ListInstancesOutputDto>
{
  constructor(private readonly instanceRepository: IInstanceRepository) {}

  @Get('list-offers')
  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  async handle(): Promise<IHttpResponse<ListInstancesOutputDto | Error>> {
    const offers = await this.instanceRepository.listInstances();
    return ok(new ListInstancesOutputDto(offers));
  }
}
