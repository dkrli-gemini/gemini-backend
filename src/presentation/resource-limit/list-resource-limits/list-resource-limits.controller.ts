import { Controller, Get, Param, Req } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { ListResourceLimitsOutputDto } from './dtos/list-resource-limits.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { IResourceLimitRepository } from 'src/domain/repository/resource-limit.repository';
import { PrismaService } from 'src/infra/db/prisma.service';
import { BillingService } from 'src/data-layer/services/billing/billing.service';
import { throwsException } from 'src/utilities/exception';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';

@Controller('resource-limits')
export class ListResourceLimitsController
  implements IController<null, ListResourceLimitsOutputDto>
{
  constructor(
    private readonly resourceLimitRepository: IResourceLimitRepository,
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
  ) {}

  @AuthorizedTo(RolesEnum.ADMIN)
  @Get('/domain/:domainId')
  async handleDomain(
    _input: null,
    @Req() _req: Request,
    @Param('domainId') domainId: string,
  ): Promise<IHttpResponse<ListResourceLimitsOutputDto | Error>> {
    await this.billingService.reconcileUsage(domainId);
    const resources = await this.resourceLimitRepository.listByDomain(
      domainId,
    );
    return ok(new ListResourceLimitsOutputDto(resources));
  }

  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  @Get('/:projectId')
  async handle(
    input: null,
    @Req() req: Request,
    @Param('projectId') projectId?: string,
  ): Promise<IHttpResponse<ListResourceLimitsOutputDto | Error>> {
    const project = await this.prisma.projectModel.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throwsException(new InvalidParamError('Projeto não encontrado.'));
    }

    await this.billingService.reconcileUsage(project.domainId, projectId);

    const resources = await this.resourceLimitRepository.listByDomain(
      project.domainId,
    );

    return ok(new ListResourceLimitsOutputDto(resources));
  }
}
