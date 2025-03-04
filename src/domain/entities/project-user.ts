import { IEntityBase } from '../models/entity-base';
import { ProjectRole } from '../types/project-role';
import { IProject } from './project';
import { IUser } from './user';

export interface IProjectUser extends IEntityBase {
  user: IUser;
  project: IProject;
  role: ProjectRole;
}
