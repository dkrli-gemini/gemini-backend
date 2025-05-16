import { Controller, Get, Param } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { ListNetworksOutputDto } from './dtos/list-networks.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';
import { NetworkModel } from '@prisma/client';

@Controller('projects')
export class ListNetworksController
  implements IController<null, ListNetworksOutputDto>
{
  constructor(private readonly prisma: PrismaService) {}

  @AuthorizedTo(RolesEnum.ADMIN, RolesEnum.BASIC)
  @Get('list-networks/:projectId')
  async handle(
    input: null,
    req: Request,
    @Param('projectId') projectId?: string,
  ): Promise<IHttpResponse<ListNetworksOutputDto | Error>> {
    const project = await this.prisma.projectModel.findUnique({
      where: {
        id: projectId,
      },
    });

    const networks = await this.prisma.networkModel.findMany({
      where: {
        domainModelId: project.domainId,
      },
    });

    const response = this.mapToOutput(networks);
    return ok(response);
  }

  private mapToOutput(networks: NetworkModel[]) {
    return new ListNetworksOutputDto(networks);
  }
}
