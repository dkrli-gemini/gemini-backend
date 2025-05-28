import { IEntityBase } from '../models/entity-base';
import { IInstance } from './instance';
import { IProject } from './project';
import { ITemplate } from './template';

export enum VirtualMachineState {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
}

export interface IVirtualMachine extends IEntityBase {
  name: string;
  state: string;
  ipAddress: string;
  cloudstackId: string;
  instance: IInstance;
  template: ITemplate;
  project: IProject;
}
