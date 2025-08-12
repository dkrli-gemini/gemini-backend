import { Controller, Get, Param, Req } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { ListResourceLimitsOutputDto } from './dtos/list-resource-limits.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { IResourceLimitRepository } from 'src/domain/repository/resource-limit.repository';
import { PrismaService } from 'src/infra/db/prisma.service';

@Controller('resource-limits')
export class ListResourceLimitsController
  implements IController<null, ListResourceLimitsOutputDto>
{
  constructor(
    private readonly resourceLimitRepository: IResourceLimitRepository,
    private readonly prisma: PrismaService,
  ) {}

  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  @Get('/:projectId')
  async handle(
    input: null,
    @Req() req: Request,
    @Param('projectId') projectId?: string,
  ): Promise<IHttpResponse<ListResourceLimitsOutputDto | Error>> {
    const domain = await this.prisma.projectModel.findUnique({
      where: { id: projectId },
    });
    const resources = await this.resourceLimitRepository.listByDomain(
      domain.domainId,
    );

    return ok(new ListResourceLimitsOutputDto(resources));
  }
}
