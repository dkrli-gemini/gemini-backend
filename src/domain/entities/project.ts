import { IEntityBase } from '../models/entity-base';
import { IProjectUser } from './project-user';

export interface IProject extends IEntityBase {
  name: string;
  users?: IProjectUser[];
}
