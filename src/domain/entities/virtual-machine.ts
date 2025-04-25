import { IEntityBase } from '../models/entity-base';
import { IProject } from './project';

export interface IVirtualMachine extends IEntityBase {
  name: string;
  os: string;
  state: string;
  ipAddress: string;
  cloudstackId: string;
  cloudstackTemplateId: string;
  cloudstackOfferId: string;
  project: IProject;
}
