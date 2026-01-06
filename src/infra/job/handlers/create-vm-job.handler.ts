import { Injectable, Logger } from '@nestjs/common';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';
import { JobHandler, CloudstackJobResult } from './job-handler';
import { IJob, JobTypeEnum } from 'src/domain/entities/job';

@Injectable()
export class CreateVmJobHandler implements JobHandler {
  readonly type = JobTypeEnum.CreateVM;
  private readonly logger = new Logger(CreateVmJobHandler.name);

  constructor(
    private readonly cloudstack: CloudstackService,
    private readonly prisma: PrismaService,
  ) {}

  async handleSuccess(job: IJob, _result: CloudstackJobResult): Promise<void> {
    this.logger.debug(`Fetching VM ${job.entityId} IP after creation`);
    const virtualMachine = await this.cloudstack.handle({
      command: CloudstackCommands.VirtualMachine.ListVirtualMachines,
      additionalParams: {
        id: job.entityId,
      },
    });

    const ip =
      virtualMachine.listvirtualmachinesresponse.virtualmachine[0].ipaddress;

    await this.prisma.virtualMachineModel.update({
      where: { id: job.entityId },
      data: { ipAddress: ip },
    });
  }

  async handleFailure(
    job: IJob,
    _result: CloudstackJobResult,
  ): Promise<void> {
    await this.prisma.virtualMachineModel.update({
      where: { id: job.entityId },
      data: { state: 'ERROR' },
    });
  }
}
