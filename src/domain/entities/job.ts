import { IEntityBase } from '../models/entity-base';

export enum JobStatusEnum {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export enum JobTypeEnum {
  StartVM = 'StartVM',
  StopVM = 'StopVM',
}

export interface IJob extends IEntityBase {
  cloudstackJobId: string;
  status: JobStatusEnum;
  type: JobTypeEnum;
  error?: string;
  entityId?: string;
}
