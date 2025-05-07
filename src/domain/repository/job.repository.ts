import { IRepositoryBase } from '../contracts/repository-base';
import { IJob, JobStatusEnum } from '../entities/job';

export abstract class IJobRepository implements IRepositoryBase<IJob> {
  abstract createJob(job: IJob): Promise<IJob>;
  abstract findPendingJobs(): Promise<IJob[]>;
  abstract updateJobStatus(jobId: string, status: JobStatusEnum): Promise<void>;
  abstract mapToDomain(persistencyObject: any): IJob;
}
