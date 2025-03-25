import { IEntityBase } from '../models/entity-base';
import { IDomain } from './domain';
import { IDomainMember } from './domain-member';

export enum ProjectTypeEnum {
  ROOT = 'ROOT',
  MEMBER = 'MEMBER',
}

export interface IProject extends IEntityBase {
  name: string;
  type: ProjectTypeEnum;
  domain?: IDomain;
  members?: IDomainMember[];
}
