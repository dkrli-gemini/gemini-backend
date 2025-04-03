import { Injectable, Provider } from '@nestjs/common';
import { Network } from 'inspector/promises';
import { mapTo } from 'rxjs';
import { IDomain } from 'src/domain/entities/domain';
import { INetwork } from 'src/domain/entities/network';
import { INetworkRepository } from 'src/domain/repository/network.repository';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class NetworkRepositoryAdapter implements INetworkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createNetwork(input: Partial<INetwork>): Promise<INetwork> {
    const networkCreated = await this.prisma.networkModel.create({
      data: {
        cloudstackId: input.cloudstackId,
        cloudstackAclId: input.cloudstackAclId,
        cloudstackOfferId: input.cloudstackOfferId,
        name: input.name,
        gateway: input.gateway,
        netmask: input.netmask,
        domainModelId: input.domain.id,
      },
    });

    return this.mapToDomain(networkCreated);
  }

  async getNetwork(networkId: string): Promise<INetwork> {
    const network = await this.prisma.networkModel.findUnique({
      where: {
        id: networkId,
      },
    });

    return this.mapToDomain(network);
  }

  mapToDomain(persistencyObject: any): INetwork {
    const network: INetwork = {
      id: persistencyObject.id,
      cloudstackId: persistencyObject.cloudstackId,
      cloudstackAclId: persistencyObject.cloudstackAclId,
      cloudstackOfferId: persistencyObject.cloudstackOfferId,
      name: persistencyObject.name,
      gateway: persistencyObject.gateway,
      netmask: persistencyObject.netmask,
      domain: {
        id: persistencyObject.domainModelId,
      } as IDomain,
    };
    return network;
  }
}

export const NetworkRepositoryProvider: Provider = {
  provide: INetworkRepository,
  useClass: NetworkRepositoryAdapter,
};
