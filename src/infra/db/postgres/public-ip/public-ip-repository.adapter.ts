import { IPublicIp, IPortForwardRule } from 'src/domain/entities/public-ips';
import { IPublicIPRepository } from 'src/domain/repository/public-ip.repository';
import { PrismaService } from '../../prisma.service';
import { Injectable, Provider } from '@nestjs/common';

@Injectable()
export class PublicIpRepositoryAdapter implements IPublicIPRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPublicIp(
    id: string,
    address: string,
    vpcId: string,
    projectId: string,
  ): Promise<IPublicIp> {
    const publicIpCreated = await this.prisma.publicIPModel.create({
      data: {
        id,
        vpcId,
        address,
        projectId,
      },
    });

    return publicIpCreated;
  }

  async addPortForwardingRule(
    publicIpId: string,
    input: IPortForwardRule,
  ): Promise<IPortForwardRule> {
    const ruleCreated = await this.prisma.portForwardRuleModel.create({
      data: {
        id: input.id,
        privatePortEnd: input.privatePortEnd,
        privatePortStart: input.privatePortStart,
        protocol: input.protocol,
        publicPortEnd: input.publicPortEnd,
        publicPortStart: input.publicPortStart,
        virtualMachineId: input.virtualMachineId,
        sourceCidrs: input.sourceCidrs,
        publicIpId,
      },
    });

    return ruleCreated as IPortForwardRule;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mapToDomain(_persistencyObject: any): IPublicIp {
    return null;
  }
}

export const PublicIpRepositoryProvider: Provider = {
  provide: IPublicIPRepository,
  useClass: PublicIpRepositoryAdapter,
};
