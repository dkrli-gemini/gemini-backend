import { IEntityBase } from '../models/entity-base';

export enum ResourceTypeEnum {
  INSTANCES = 'INSTANCES',
  CPU = 'CPU',
  MEMORY = 'MEMORY',
  VOLUMES = 'VOLUMES',
  PUBLICIP = 'PUBLICIP',
  NETWORK = 'NETWORK',
}

export interface IResourceLimit extends IEntityBase {
  type: ResourceTypeEnum;
  limit: number;
  used: number;
  domainId: string;
}
