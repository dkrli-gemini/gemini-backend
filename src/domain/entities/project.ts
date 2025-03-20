import { IEntityBase } from '../models/entity-base';
import { IDomain } from './domain';

export enum ProjectTypeEnum {
  ROOT = 'ROOT',
  MEMBER = 'MEMBER',
}

export interface IProject extends IEntityBase {
  name: string;
  type: ProjectTypeEnum;
  domain?: IDomain;
}
