import { IEntityBase } from '../models/entity-base';
import { IInstance } from './instance';
import { INetwork } from './network';
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
  cpuNumber?: number;
  cpuSpeedMhz?: number;
  memoryInMb?: number;
  rootDiskSizeInGb?: number;
  instance: IInstance;
  template: ITemplate;
  project: IProject;
  network: INetwork;
}
