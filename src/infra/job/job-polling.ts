import { Inject, Injectable, Logger } from '@nestjs/common';
import { IJobRepository } from 'src/domain/repository/job.repository';
import {
  CloudstackCommands,
  CloudstackService,
} from '../cloudstack/cloudstack';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IJob, JobStatusEnum, JobTypeEnum } from 'src/domain/entities/job';
import { JOB_HANDLER_MAP } from './job.constants';
import { CloudstackJobResult, JobHandler } from './handlers/job-handler';

@Injectable()
export class JobPollingService {
  private readonly logger = new Logger(JobPollingService.name);

  constructor(
    private readonly jobRepository: IJobRepository,
    private readonly cloudstackService: CloudstackService,
    @Inject(JOB_HANDLER_MAP)
    private readonly handlerMap: Map<JobTypeEnum, JobHandler>,
  ) {}

  private getHandler(type: JobTypeEnum): JobHandler | undefined {
    const handler = this.handlerMap.get(type);

    if (!handler) {
      this.logger.warn(`No job handler registered for type ${type}`);
    }

    return handler;
  }

  private normalizeStatus(status?: number | string): number {
    if (status === undefined || status === null) {
      return 0;
    }

    return typeof status === 'string' ? Number(status) || 0 : status;
  }

  private extractJobError(result: CloudstackJobResult): string | undefined {
    const errorCandidates = [
      result?.jobresult?.errortext,
      result?.jobresult?.errordetail,
      result?.jobresult?.description,
    ].filter(Boolean) as string[];

    return errorCandidates[0];
  }

  private async handleSuccess(job: IJob, result: CloudstackJobResult) {
    const handler = this.getHandler(job.type);
    if (!handler) {
      await this.jobRepository.updateJobStatus(job.id, JobStatusEnum.DONE);
      return;
    }

    try {
      await handler.handleSuccess(job, result);
      await this.jobRepository.updateJobStatus(job.id, JobStatusEnum.DONE);
    } catch (error) {
      this.logger.error(
        `Error while handling success for job ${job.id} (${job.type})`,
        error instanceof Error ? error.stack : String(error),
      );
      await this.jobRepository.updateJobStatus(
        job.id,
        JobStatusEnum.FAILED,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  private async handleFailure(
    job: IJob,
    result: CloudstackJobResult,
    errorMessage?: string,
  ) {
    const handler = this.getHandler(job.type);
    if (handler?.handleFailure) {
      try {
        await handler.handleFailure(job, result, errorMessage);
      } catch (error) {
        this.logger.error(
          `Error while handling failure for job ${job.id} (${job.type})`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }

    await this.jobRepository.updateJobStatus(
      job.id,
      JobStatusEnum.FAILED,
      errorMessage,
    );
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
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
                jobid: pJob.id,
              },
            })
          ).queryasyncjobresultresponse as CloudstackJobResult;
          const jobStatus = this.normalizeStatus(jobResponse?.jobstatus);
          this.logger.debug(
            `Handling async job ${pJob.id}, with command ${pJob.type} and status ${jobStatus}`,
          );

          if (jobStatus === 1) {
            await this.handleSuccess(pJob, jobResponse);
          } else if (jobStatus === 2) {
            const errorMessage =
              this.extractJobError(jobResponse) ?? 'Unknown CloudStack error';
            this.logger.error(
              `CloudStack job ${pJob.id} failed: ${errorMessage}`,
            );
            await this.handleFailure(pJob, jobResponse, errorMessage);
          } else {
            this.logger.debug(
              `Job ${pJob.id} still pending in CloudStack (status ${jobStatus})`,
            );
          }
        } catch (jobPollingError) {
          this.logger.error(
            `Error polling CS job ${pJob.id}, with ${jobPollingError}`,
          );
        }
        this.logger.log('Finished CloudStack polling cycle.');
      }
    } catch (mainPollingError) {
      this.logger.error(`Error in main polling logic: ${mainPollingError}`);
    }
  }
}
