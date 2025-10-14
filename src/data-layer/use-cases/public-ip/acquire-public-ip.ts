import { Injectable, Provider } from '@nestjs/common';
import {
  IAcquirePublicIp,
  IAcquirePublicIpInput,
} from 'src/domain/contracts/use-cases/public-ip/acquire-public-ip';
import { JobStatusEnum, JobTypeEnum } from 'src/domain/entities/job';
import { IPublicIp } from 'src/domain/entities/public-ips';
import { IJobRepository } from 'src/domain/repository/job.repository';
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
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute({ projectId }: IAcquirePublicIpInput): Promise<IPublicIp> {
    const project = await this.prisma.projectModel.findUnique({
      where: { id: projectId },
    });
    const domain = await this.prisma.domainModel.findUnique({
      where: { id: project.domainId },
    });
    const vpcId = domain.vpcId;

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

    await this.jobRepository.createJob({
      id: cloudstackIp.associateipaddressresponse.jobid,
      status: JobStatusEnum.PENDING,
      type: JobTypeEnum.AttachIP,
      entityId: cloudstackIp.associateipaddressresponse.id,
    });

    return ipCreated;
  }
}

export const AcquirePublicIpProvider: Provider = {
  provide: IAcquirePublicIp,
  useClass: AcquirePublicIp,
};
