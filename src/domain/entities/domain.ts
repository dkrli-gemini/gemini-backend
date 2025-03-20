import { IEntityBase } from '../models/entity-base';
import { IProject } from './project';

export interface IDomain extends IEntityBase {
  name: string;
  cloudstackDomainId?: string;
  cloudstackAccountId?: string;
  rootProject: IProject;
}
