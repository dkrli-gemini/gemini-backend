import { IEntityBase } from '../models/entity-base';
import { IProject } from './project';

export interface INetwork extends IEntityBase {
  name: string;
  cloudstackId: string;
  cloudstackOfferId: string;
  cloudstackAclId: string;
  gateway: string;
  netmask: string;
  project: IProject;
}
