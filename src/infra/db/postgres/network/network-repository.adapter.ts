import { Injectable, Provider } from '@nestjs/common';
import { INetwork } from 'src/domain/entities/network';
import { INetworkRepository } from 'src/domain/repository/network.repository';
import { PrismaService } from '../../prisma.service';
import { IProject } from 'src/domain/entities/project';

@Injectable()
export class NetworkRepositoryAdapter implements INetworkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createNetwork(input: Partial<INetwork>): Promise<INetwork> {
    const aclName = (
      await this.prisma.aclListModel.findUnique({
        where: { id: input.cloudstackAclId },
      })
    ).name;

    const networkCreated = await this.prisma.networkModel.create({
      data: {
        id: input.id,
        cloudstackAclId: input.cloudstackAclId,
        cloudstackOfferId: input.cloudstackOfferId,
        name: input.name,
        gateway: input.gateway,
        netmask: input.netmask,
        isL2: input.isL2 ?? false,
        projectId: input.project.id,
        aclName: aclName,
      },
    });

    return this.mapToDomain(networkCreated);
  }

  async getNetwork(networkId: string): Promise<INetwork | null> {
    const network = await this.prisma.networkModel.findUnique({
      where: {
        id: networkId,
      },
    });

    if (!network) {
      return null;
    }

    return this.mapToDomain(network);
  }

  mapToDomain(persistencyObject: any): INetwork {
    const network: INetwork = {
      id: persistencyObject.id,
      cloudstackAclId: persistencyObject.cloudstackAclId,
      cloudstackOfferId: persistencyObject.cloudstackOfferId,
      name: persistencyObject.name,
      gateway: persistencyObject.gateway,
      netmask: persistencyObject.netmask,
      isL2: persistencyObject.isL2,
      project: {
        id: persistencyObject.projectId,
      } as IProject,
    };
    return network;
  }
}

export const NetworkRepositoryProvider: Provider = {
  provide: INetworkRepository,
  useClass: NetworkRepositoryAdapter,
};
