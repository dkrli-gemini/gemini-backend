import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IController } from 'src/domain/contracts/controller';
import { IHttpResponse, ok } from 'src/domain/contracts/http';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import { AuthorizedTo } from 'src/infra/auth/auth.decorator';
import { RolesEnum } from 'src/infra/auth/roles.guard';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';
import { throwsException } from 'src/utilities/exception';
import { CreateL2NetworkInputDto } from './dtos/create-l2-network.input.dto';
import { CreateL2NetworkOutputDto } from './dtos/create-l2-network.output.dto';

@Controller('admin')
@ApiTags('admin')
export class CreateL2NetworkController
  implements IController<CreateL2NetworkInputDto, CreateL2NetworkOutputDto>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudstackService: CloudstackService,
  ) {}

  @AuthorizedTo(RolesEnum.ADMIN)
  @Post('l2-networks')
  async handle(
    @Body() input: CreateL2NetworkInputDto,
  ): Promise<IHttpResponse<CreateL2NetworkOutputDto | Error>> {
    const project = await this.prisma.projectModel.findUnique({
      where: { id: input.projectId },
      include: { domain: true },
    });

    if (!project) {
      throwsException(new InvalidParamError('Projeto não encontrado.'));
    }

    const existing = await this.prisma.networkModel.findUnique({
      where: { id: input.networkId },
    });

    if (existing && existing.projectId !== project.id) {
      throwsException(
        new InvalidParamError('Rede já associada a outro projeto.'),
      );
    }

    const cloudstackResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.Network.ListNetworks,
      additionalParams: {
        id: input.networkId,
      },
    });

    const cloudNetworksRaw =
      cloudstackResponse?.listnetworksresponse?.network ?? [];
    const cloudNetworks = Array.isArray(cloudNetworksRaw)
      ? cloudNetworksRaw
      : [cloudNetworksRaw];

    const network = cloudNetworks.find(
      (net: any) => net?.id === input.networkId,
    );

    if (!network || !this.isL2Network(network)) {
      throwsException(new InvalidParamError('Rede L2 não encontrada.'));
    }

    const saved = await this.prisma.networkModel.upsert({
      where: { id: input.networkId },
      update: {
        name: network.name ?? existing?.name ?? 'Rede L2',
        cloudstackOfferId: network.networkofferingid ?? existing?.cloudstackOfferId ?? '',
        cloudstackAclId: network.aclid ?? existing?.cloudstackAclId ?? '',
        aclName: network.aclname ?? existing?.aclName ?? 'L2',
        gateway: network.gateway ?? existing?.gateway ?? '-',
        netmask: network.netmask ?? existing?.netmask ?? '-',
        projectId: project.id,
        isL2: true,
      },
      create: {
        id: input.networkId,
        name: network.name ?? 'Rede L2',
        cloudstackOfferId: network.networkofferingid ?? '',
        cloudstackAclId: network.aclid ?? '',
        aclName: network.aclname ?? 'L2',
        gateway: network.gateway ?? '-',
        netmask: network.netmask ?? '-',
        projectId: project.id,
        isL2: true,
      },
    });

    return ok(
      new CreateL2NetworkOutputDto({
        id: saved.id,
        name: saved.name,
        projectId: saved.projectId,
        isL2: saved.isL2,
      }),
    );
  }

  private isL2Network(network: any): boolean {
    const type = String(network?.type ?? network?.networktype ?? '').toLowerCase();
    if (type === 'l2' || type === 'l2network') {
      return true;
    }

    const broadcast = String(network?.broadcastdomaintype ?? '').toLowerCase();
    if (broadcast.includes('l2') || broadcast.includes('lswitch')) {
      return true;
    }

    const flags = [network?.isL2, network?.isl2, network?.l2network];
    return flags.some((flag) => flag === true);
  }
}
