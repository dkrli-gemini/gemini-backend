import { Controller, Get, Param } from '@nestjs/common';
import { IController } from 'src/domain/contracts/controller';
import { ListNetworksOutputDto } from './dtos/list-networks.output.dto';
import { Request } from 'express';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';

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
    const networks = await this.prisma.networkModel.findMany({
      where: {
        projectId: projectId,
      },
      select: {
        id: true,
        name: true,
        gateway: true,
        netmask: true,
        aclName: true,
        isL2: true,
      },
    });

    const response = this.mapToOutput(networks);
    return ok(response);
  }

  private mapToOutput(
    networks: Array<{
      id: string;
      name: string;
      gateway: string;
      netmask: string;
      aclName: string | null;
      isL2: boolean;
    }>,
  ) {
    return new ListNetworksOutputDto(networks);
  }
}
