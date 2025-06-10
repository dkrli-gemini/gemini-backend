import { Injectable, Provider } from '@nestjs/common';
import {
  IAcquirePublicIp,
  IAcquirePublicIpInput,
} from 'src/domain/contracts/use-cases/public-ip/acquire-public-ip';
import { IPublicIp } from 'src/domain/entities/public-ips';
import { IPublicIPRepository } from 'src/domain/repository/public-ip.repository';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';

@Injectable()
export class AcquirePublicIp implements IAcquirePublicIp {
  constructor(
    private readonly publicIpRepository: IPublicIPRepository,
    private readonly cloudstack: CloudstackService,
    private readonly prisma: PrismaService,
  ) {}

  async execute({ vpcId }: IAcquirePublicIpInput): Promise<IPublicIp> {
    const cloudstackIp = await this.cloudstack.handle({
      command: CloudstackCommands.VPC.AssociateIpAddress,
      additionalParams: {
        vpcid: vpcId,
      },
    });
    console.log(cloudstackIp);

    const ipCreated = await this.publicIpRepository.createPublicIp(
      cloudstackIp.associateipaddressresponse.id,
      '',
      vpcId,
    );

    return ipCreated;
  }
}

export const AcquirePublicIpProvider: Provider = {
  provide: IAcquirePublicIp,
  useClass: AcquirePublicIp,
};
