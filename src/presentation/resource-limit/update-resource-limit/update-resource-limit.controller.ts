import { Body, Controller, Param, Patch, Req } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { UpdateResourceLimitInputDto } from './dtos/update-resource-limit.input.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { IResourceLimitRepository } from 'src/domain/repository/resource-limit.repository';
import { ResourceLimitDto } from '../list-resource-limits/dtos/list-resource-limits.output.dto';

@Controller('resource-limits')
export class UpdateResourceLimitController
  implements IController<UpdateResourceLimitInputDto, ResourceLimitDto>
{
  constructor(
    private readonly resourceLimitRepository: IResourceLimitRepository,
  ) {}

  @Patch('/:limitId')
  @AuthorizedTo(RolesEnum.ADMIN)
  async handle(
    @Body() input: UpdateResourceLimitInputDto,
    @Req() _req: Request,
    @Param('limitId') limitId: string,
  ): Promise<IHttpResponse<ResourceLimitDto | Error>> {
    const updated = await this.resourceLimitRepository.updateResourceLimit(
      limitId,
      input.limit,
    );

    return ok(new ResourceLimitDto(updated));
  }
}
