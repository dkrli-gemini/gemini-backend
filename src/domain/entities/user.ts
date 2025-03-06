import { IEntityBase } from '../models/entity-base';

export interface IUser extends IEntityBase {
  email: string;
  name: string;
  authId: string;
}
