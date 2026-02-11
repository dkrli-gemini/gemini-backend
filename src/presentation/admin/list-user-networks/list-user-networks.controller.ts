import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import { PrismaService } from 'src/infra/db/prisma.service';
import { throwsException } from 'src/utilities/exception';
import { Request } from 'express';
import {
  ListUserNetworksOutputDto,
  UserNetworkDto,
  UserProjectNetworksDto,
} from './dtos/list-user-networks.output.dto';

@Controller('admin')
@ApiTags('admin')
export class ListUserNetworksController
  implements IController<null, ListUserNetworksOutputDto>
{
  constructor(private readonly prisma: PrismaService) {}

  @AuthorizedTo(RolesEnum.ADMIN)
  @Get('users/:userId/networks')
  async handle(
    _input: null,
    @Req() _req: Request,
    @Param('userId') userId?: string,
  ): Promise<IHttpResponse<ListUserNetworksOutputDto | Error>> {
    if (!userId) {
      throwsException(new InvalidParamError('userId é obrigatório.'));
    }

    const memberships = await this.prisma.domainMemberModel.findMany({
      where: { userId },
      include: { project: true },
    });

    const projects = await Promise.all(
      memberships.map(async (membership) => {
        const projectId = membership.projectModelId ?? membership.project?.id;

        if (!projectId) {
          return new UserProjectNetworksDto({
            projectId: 'unknown',
            projectName: 'Projeto não encontrado',
            networks: [],
          });
        }

        const networks = await this.prisma.networkModel.findMany({
          where: { projectId },
        });

        const mappedNetworks = networks.map(
          (network) =>
            new UserNetworkDto({
              id: network.id,
              name: network.name,
              gateway: network.gateway,
              netmask: network.netmask,
              aclName: network.aclName,
              isL2: network.isL2,
            }),
        );

        return new UserProjectNetworksDto({
          projectId,
          projectName: membership.project?.name ?? 'Projeto sem nome',
          networks: mappedNetworks,
        });
      }),
    );

    return ok(new ListUserNetworksOutputDto(projects));
  }
}
