import { Injectable, Provider } from '@nestjs/common';
import {
  IAcquirePublicIp,
  IAcquirePublicIpInput,
} from 'src/domain/contracts/use-cases/public-ip/acquire-public-ip';
import { JobStatusEnum, JobTypeEnum } from 'src/domain/entities/job';
import { IPublicIp } from 'src/domain/entities/public-ips';
import { IJobRepository } from 'src/domain/repository/job.repository';
import { IPublicIPRepository } from 'src/domain/repository/public-ip.repository';
import { InvalidParamError } from 'src/domain/errors/invalid-param.error';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';
import { BillingService } from 'src/data-layer/services/billing/billing.service';
import { ResourceTypeEnum } from 'src/domain/entities/resource-limit';

@Injectable()
export class AcquirePublicIp implements IAcquirePublicIp {
  constructor(
    private readonly publicIpRepository: IPublicIPRepository,
    private readonly cloudstack: CloudstackService,
    private readonly prisma: PrismaService,
    private readonly jobRepository: IJobRepository,
    private readonly billingService: BillingService,
  ) {}

  async execute({ projectId }: IAcquirePublicIpInput): Promise<IPublicIp> {
    const project = await this.prisma.projectModel.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new InvalidParamError('Projeto não encontrado.');
    }

    const domain = await this.prisma.domainModel.findUnique({
      where: { id: project.domainId },
    });

    if (!domain) {
      throw new InvalidParamError('Domínio não encontrado.');
    }
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
      projectId,
    );

    await this.jobRepository.createJob({
      id: cloudstackIp.associateipaddressresponse.jobid,
      status: JobStatusEnum.PENDING,
      type: JobTypeEnum.AttachIP,
      entityId: cloudstackIp.associateipaddressresponse.id,
    });

    await this.billingService.registerUsage({
      domainId: domain.id,
      projectId,
      consumptions: [
        {
          resourceId: ipCreated.id,
          resourceType: ResourceTypeEnum.PUBLICIP,
          quantity: 1,
          description: `IP público associado`,
          metadata: {
            vpcId,
          },
        },
      ],
    });

    return ipCreated;
  }
}

export const AcquirePublicIpProvider: Provider = {
  provide: IAcquirePublicIp,
  useClass: AcquirePublicIp,
};
