import { IEntityBase } from '../models/entity-base';
import { IInstance } from './instance';
import { IProject } from './project';

export enum VirtualMachineState {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
}

export interface IVirtualMachine extends IEntityBase {
  name: string;
  os: string;
  state: string;
  ipAddress: string;
  cloudstackId: string;
  instance: IInstance;
  cloudstackTemplateId: string;
  project: IProject;
}
