import { IJob, JobTypeEnum } from 'src/domain/entities/job';

export interface CloudstackJobResult {
  jobid?: string;
  jobstatus?: number | string;
  jobresult?: Record<string, any>;
  jobresulttype?: string;
  jobprocstatus?: number;
  jobresultcode?: number;
}

export interface JobHandler {
  readonly type: JobTypeEnum;
  handleSuccess(job: IJob, result: CloudstackJobResult): Promise<void>;
  handleFailure?(
    job: IJob,
    result: CloudstackJobResult,
    errorMessage?: string,
  ): Promise<void>;
}
