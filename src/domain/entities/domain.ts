import { IEntityBase } from '../models/entity-base';
import { IProject } from './project';
import { IVPC } from './vpc';

export enum IDomainType {
  ROOT = 'ROOT',
  PARTNER = 'PARTNER',
  CLIENT = 'CLIENT',
}

export interface IDomain extends IEntityBase {
  name: string;
  root?: IDomain;
  type?: IDomainType;
  vpc: IVPC;
  cloudstackAccountId?: string;
  projects?: IProject[];
}
