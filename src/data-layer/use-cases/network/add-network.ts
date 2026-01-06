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
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';
import { throwsException } from 'src/utilities/exception';
import { BillingService } from 'src/data-layer/services/billing/billing.service';
import { ResourceTypeEnum } from 'src/domain/entities/resource-limit';

@Injectable()
export class AddNetwork implements IAddNetwork {
  private defaultZoneId: string;

  constructor(
    private readonly networkRepository: INetworkRepository,
    private readonly cloudstackService: CloudstackService,
    private readonly domainRepository: IDomainRepository,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
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

    if (!project) {
      throwsException(new InvalidParamError('Projeto não encontrado.'));
    }

    if (!project.domainId) {
      throwsException(
        new InvalidParamError('Projeto não está associado a um domínio.'),
      );
    }

    const domain = await this.prisma.domainModel.findUnique({
      where: {
        id: project.domainId,
      },
      include: {
        vpc: true,
      },
    });

    if (!domain) {
      throwsException(
        new InvalidParamError('Domínio associado ao projeto não encontrado.'),
      );
    }

    if (!domain.vpc) {
      throwsException(
        new InvalidParamError('Domínio associado não possui uma VPC configurada.'),
      );
    }

    if (!domain.rootId) {
      throwsException(
        new InvalidParamError('Domínio associado não possui um domínio raiz definido.'),
      );
    }

    const cloudstackNetwork = await this.cloudstackService.handle({
      command: CloudstackCommands.Network.CreateNetwork,
      additionalParams: {
        name: input.name,
        networkofferingid: input.cloudstackOfferId,
        zoneid: this.defaultZoneId,
        aclid: input.cloudstackAclId,
        gateway: input.gateway,
        netmask: input.netmask,
        account: domain.name,
        domainid: domain.rootId,
        vpcid: domain.vpc.id,
      },
    });

    console.log(cloudstackNetwork);

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

    await this.billingService.registerUsage({
      domainId: domain.id,
      projectId: project.id,
      consumptions: [
        {
          resourceId: networkCreated.id,
          resourceType: ResourceTypeEnum.NETWORK,
          quantity: 1,
          description: `Rede ${networkCreated.name}`,
          metadata: {
            gateway: input.gateway,
          },
        },
      ],
    });

    return networkCreated;
  }
}

export const AddNetworkProvider: Provider = {
  provide: IAddNetwork,
  useClass: AddNetwork,
};
