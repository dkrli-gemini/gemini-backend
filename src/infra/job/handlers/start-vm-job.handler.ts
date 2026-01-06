import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma.service';
import { JobHandler, CloudstackJobResult } from './job-handler';
import { IJob, JobTypeEnum } from 'src/domain/entities/job';

@Injectable()
export class StartVmJobHandler implements JobHandler {
  readonly type = JobTypeEnum.StartVM;

  constructor(private readonly prisma: PrismaService) {}

  async handleSuccess(job: IJob, _result: CloudstackJobResult): Promise<void> {
    await this.prisma.virtualMachineModel.update({
      where: { id: job.entityId },
      data: { state: 'RUNNING' },
    });
  }

  async handleFailure(
    job: IJob,
    _result: CloudstackJobResult,
  ): Promise<void> {
    await this.prisma.virtualMachineModel.update({
      where: { id: job.entityId },
      data: { state: 'STOPPED' },
    });
  }
}
