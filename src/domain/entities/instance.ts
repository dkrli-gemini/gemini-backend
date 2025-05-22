import { IEntityBase } from '../models/entity-base';

export interface IInstance extends IEntityBase {
  cloudstackId: string;
  name: string;
  memory: string;
  disk: string;
  cpu: string;
}
