import { IEntityBase } from '../models/entity-base';
import { IProject } from './project';
import { IVPC } from './vpc';

export enum IDomainType {
  ROOT = 'ROOT',
  PARTNER = 'PARTNER',
  CLIENT = 'CLIENT',
}

export enum OrganizationBillingType {
  POOL = 'POOL',
  PAYG = 'PAYG',
}

export interface IDomain extends IEntityBase {
  name: string;
  root?: IDomain;
  type?: IDomainType;
  isDistributor?: boolean;
  vpc: IVPC;
  cloudstackAccountId?: string;
  projects?: IProject[];
  billingType?: OrganizationBillingType;
}
