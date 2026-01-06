import { IRepositoryBase } from '../contracts/repository-base';
import { IJob, JobStatusEnum } from '../entities/job';

export abstract class IJobRepository implements IRepositoryBase<IJob> {
  abstract createJob(job: IJob): Promise<IJob>;
  abstract findPendingJobs(): Promise<IJob[]>;
  abstract getJob(jobId: string): Promise<IJob | null>;
  abstract updateJobStatus(
    jobId: string,
    status: JobStatusEnum,
    error?: string,
  ): Promise<void>;
  abstract mapToDomain(persistencyObject: any): IJob;
}
