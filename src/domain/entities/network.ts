import { IEntityBase } from '../models/entity-base';
import { IDomain } from './domain';

export interface INetwork extends IEntityBase {
  name: string;
  cloudstackId: string;
  cloudstackOfferId: string;
  cloudstackAclId: string;
  gateway: string;
  netmask: string;
  domain: IDomain;
}
