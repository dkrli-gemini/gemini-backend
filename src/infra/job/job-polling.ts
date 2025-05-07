import { Injectable, Logger } from '@nestjs/common';
import { IJobRepository } from 'src/domain/repository/job.repository';
import {
  CloudstackCommands,
  CloudstackService,
} from '../cloudstack/cloudstack';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IJob, JobStatusEnum } from 'src/domain/entities/job';
import { JobTypeEnum } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class JobPollingService {
  private readonly logger = new Logger(JobPollingService.name);

  constructor(
    private readonly jobRepository: IJobRepository,
    private readonly cloudstackService: CloudstackService,
    private readonly prisma: PrismaService,
  ) {}

  async handleJobUpdate(type: JobTypeEnum, entityId: string) {
    this.logger.log(
      `Handling job update with type ${type} on entity ${entityId}`,
    );
    switch (type) {
      case JobTypeEnum.StartVM: {
        await this.prisma.virtualMachineModel.update({
          where: {
            id: entityId,
          },
          data: {
            state: 'RUNNING',
          },
        });
        break;
      }
      case JobTypeEnum.StopVM: {
        await this.prisma.virtualMachineModel.update({
          where: {
            id: entityId,
          },
          data: {
            state: 'STOPPED',
          },
        });
        break;
      }
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.debug('Polling service triggered. Check pending jobs');

    try {
      const pendingJobs: IJob[] = await this.jobRepository.findPendingJobs();
      if (pendingJobs.length == 0) {
        this.logger.debug('No pending jobs. Exiting');
        return;
      }
      this.logger.log(`Found ${pendingJobs.length} pending jobs`);

      for (const pJob of pendingJobs) {
        try {
          const jobResponse = (
            await this.cloudstackService.handle({
              command: CloudstackCommands.Jobs.QueryJobResult,
              additionalParams: {
                jobid: pJob.cloudstackJobId,
              },
            })
          ).queryasyncjobresultresponse;
          const jobStatus = jobResponse.jobstatus;
          this.logger.debug(
            `Handling async job ${pJob.cloudstackJobId}, with command ${pJob.type} and status ${jobStatus}`,
          );
          if (jobStatus == 1) {
            // Success
            await this.jobRepository.updateJobStatus(
              pJob.id,
              JobStatusEnum.DONE,
            );
            await this.handleJobUpdate(pJob.type, pJob.entityId);
          }
        } catch (jobPollingError) {
          this.logger.error(
            `Error polling CS job ${pJob.cloudstackJobId}, with ${jobPollingError}`,
          );
        }
        this.logger.log('Finished CloudStack polling cycle.');
      }
    } catch (mainPollingError) {
      this.logger.error(`Error in main polling logic: ${mainPollingError}`);
    }
  }
}
