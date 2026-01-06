import { Injectable } from '@nestjs/common';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';
import { JobHandler, CloudstackJobResult } from './job-handler';
import { IJob, JobTypeEnum } from 'src/domain/entities/job';

@Injectable()
export class AttachIpJobHandler implements JobHandler {
  readonly type = JobTypeEnum.AttachIP;

  constructor(
    private readonly cloudstack: CloudstackService,
    private readonly prisma: PrismaService,
  ) {}

  async handleSuccess(job: IJob, _result: CloudstackJobResult): Promise<void> {
    const publicIp = await this.cloudstack.handle({
      command: CloudstackCommands.VPC.ListPublicIpAddresses,
      additionalParams: {
        id: job.entityId,
      },
    });

    const address =
      publicIp.listpublicipaddressesresponse.publicipaddress[0].ipaddress;

    await this.prisma.publicIPModel.update({
      where: {
        id: job.entityId,
      },
      data: {
        address,
      },
    });
  }

  async handleFailure(
    job: IJob,
    _result: CloudstackJobResult,
  ): Promise<void> {
    await this.prisma.publicIPModel.update({
      where: { id: job.entityId },
      data: { address: null },
    });
  }
}
