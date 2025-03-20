import { IEntityBase } from '../models/entity-base';
import { IProject } from './project';
import { IUser } from './user';

export enum ProjectRoleEnum {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface IDomainMember extends IEntityBase {
  user: IUser;
  domain: IDomainMember;
  project: IProject;
  role: ProjectRoleEnum;
}
