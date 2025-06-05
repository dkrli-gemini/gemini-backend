import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IAddNetwork,
  IAddNetworkInput,
} from 'src/domain/contracts/use-cases/networks/add-network';
import { INetwork } from 'src/domain/entities/network';
import { IProject } from 'src/domain/entities/project';
import { IDomainRepository } from 'src/domain/repository/domain.repoitory';
import { INetworkRepository } from 'src/domain/repository/network.repository';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';

@Injectable()
export class AddNetwork implements IAddNetwork {
  private defaultZoneId: string;

  constructor(
    private readonly networkRepository: INetworkRepository,
    private readonly cloudstackService: CloudstackService,
    private readonly domainRepository: IDomainRepository,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.defaultZoneId = this.configService.get<string>(
      'CLOUDSTACK_DEFAULT_ZONE_ID',
    );
  }

  async execute(input: IAddNetworkInput): Promise<INetwork> {
    const project = await this.prisma.projectModel.findUnique({
      where: {
        id: input.projectId,
      },
    });

    const domain = await this.prisma.domainModel.findUnique({
      where: {
        id: project.domainId,
      },
      include: {
        vpc: true,
      },
    });

    const cloudstackNetwork = await this.cloudstackService.handle({
      command: CloudstackCommands.Network.CreateNetwork,
      additionalParams: {
        name: input.name,
        networkofferingid: input.cloudstackOfferId,
        zoneid: this.defaultZoneId,
        aclid: input.cloudstackAclId,
        gateway: input.gateway,
        netmask: input.netmask,
        domainid: domain.id,
        account: domain.name,
        vpcid: domain.vpc.id,
      },
    });

    const networkCreated = await this.networkRepository.createNetwork({
      id: cloudstackNetwork.createnetworkresponse.network.id,
      cloudstackAclId: input.cloudstackAclId,
      cloudstackOfferId: input.cloudstackOfferId,
      project: {
        id: project.id,
      } as IProject,
      gateway: input.gateway,
      netmask: input.netmask,
      name: input.name,
    });

    return networkCreated;
  }
}

export const AddNetworkProvider: Provider = {
  provide: IAddNetwork,
  useClass: AddNetwork,
};
