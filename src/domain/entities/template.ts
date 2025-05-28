import { IEntityBase } from '../models/entity-base';

export interface ITemplate extends IEntityBase {
  name: string;
  cloudstackId: string;
  url?: string;
}
