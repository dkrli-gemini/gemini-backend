import { IEntityBase } from '../models/entity-base';
import { IDomainMember } from './domain-member';

export interface IUser extends IEntityBase {
  email: string;
  name: string;
  domainMember?: IDomainMember[];
}
