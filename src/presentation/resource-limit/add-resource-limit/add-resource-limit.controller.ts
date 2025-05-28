import { Body, Controller, Param, Post } from '@nestjs/common';
import { AddResourceLimitInputDto } from './dtos/add-resource-limit.input.dto';
import { AddResourceLimitOutputDto } from './dtos/add-resource-limit.output.dto';
import { IController } from 'src/domain/contracts/controller';
import { Request } from 'express';
import { created, IHttpResponse } from 'src/domain/contracts/http';
import { IResourceLimitRepository } from 'src/domain/repository/resource-limit.repository';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';

@Controller('resource-limits')
export class AddResourceLimitController
  implements IController<AddResourceLimitInputDto, AddResourceLimitOutputDto>
{
  constructor(
    private readonly resourceLimitRepository: IResourceLimitRepository,
  ) {}

  @Post('/add-limit/:domainId')
  @AuthorizedTo(RolesEnum.ADMIN)
  async handle(
    @Body() input: AddResourceLimitInputDto,
    req: Request,
    @Param('domainId') domainId?: string,
  ): Promise<IHttpResponse<AddResourceLimitOutputDto | Error>> {
    const limitCreated = await this.resourceLimitRepository.createResourceLimit(
      {
        domainId: domainId,
        limit: input.limit,
        type: input.type,
        used: input.used,
      },
    );

    const response = new AddResourceLimitOutputDto(limitCreated.id);
    return created(response);
  }
}
