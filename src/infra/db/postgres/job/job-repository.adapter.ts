/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IJob } from 'src/domain/entities/job';
import { IJobRepository } from 'src/domain/repository/job.repository';
import { PrismaService } from '../../prisma.service';
import { JobStatusEnum } from '@prisma/client';
import { Injectable, Logger, Provider } from '@nestjs/common';

@Injectable()
export class JobRepositoryAdapter implements IJobRepository {
  private readonly logger = new Logger(JobRepositoryAdapter.name);

  constructor(private readonly prisma: PrismaService) {}
  async createJob(job: IJob): Promise<IJob> {
    this.logger.debug(`Creating new pending job ${job.cloudstackJobId}`);
    const jobCreated = await this.prisma.jobModel.create({
      data: {
        cloudstackJobId: job.cloudstackJobId,
        status: JobStatusEnum.PENDING,
        type: job.type,
        entityId: job.entityId,
        error: job.error,
      },
    });

    return this.mapToDomain(jobCreated);
  }

  async findPendingJobs(): Promise<IJob[]> {
    const jobs = await this.prisma.jobModel.findMany({
      where: {
        status: 'PENDING',
      },
    });

    const jobsMapped = jobs.map((j) => this.mapToDomain(j));
    return jobsMapped;
  }

  async updateJobStatus(jobId: string, status: JobStatusEnum): Promise<void> {
    await this.prisma.jobModel.update({
      where: {
        id: jobId,
      },
      data: {
        status: status,
      },
    });
  }

  mapToDomain(persistencyObject: any): IJob {
    const job: IJob = {
      id: persistencyObject.id,
      cloudstackJobId: persistencyObject.cloudstackJobId,
      status: persistencyObject.status,
      type: persistencyObject.type,
      error: persistencyObject.error ?? '',
      entityId: persistencyObject.entityId ?? '',
    };
    return job;
  }
}

export const JobRepositoryProvider: Provider = {
  provide: IJobRepository,
  useClass: JobRepositoryAdapter,
};
