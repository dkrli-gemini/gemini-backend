import { Injectable } from '@nestjs/common';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { JobHandler, CloudstackJobResult } from './job-handler';
import { IJob, JobTypeEnum } from 'src/domain/entities/job';

@Injectable()
export class AttachVolumeJobHandler implements JobHandler {
  readonly type = JobTypeEnum.AttachVolume;

  constructor(private readonly cloudstack: CloudstackService) {}

  async handleSuccess(job: IJob, _result: CloudstackJobResult): Promise<void> {
    const [volumeId, machineId] = (job.entityId ?? '').split('|');

    if (!volumeId || !machineId) {
      throw new Error(
        `Invalid attach volume payload for job ${job.id}: ${job.entityId}`,
      );
    }

    await this.cloudstack.handle({
      command: CloudstackCommands.Volume.AttachVolume,
      additionalParams: {
        id: volumeId,
        virtualmachineid: machineId,
      },
    });
  }

  async handleFailure(
    _job: IJob,
    _result: CloudstackJobResult,
  ): Promise<void> {
    // Nothing to rollback at the moment. The user can retry once the root cause is fixed.
  }
}
