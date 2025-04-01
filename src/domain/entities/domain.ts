import { IEntityBase } from '../models/entity-base';
import { IProject } from './project';
import { IVPC } from './vpc';

export interface IDomain extends IEntityBase {
  name: string;
  vpc: IVPC;
  cloudstackDomainId?: string;
  cloudstackAccountId?: string;
  rootProject: IProject;
}
