import { IEntityBase } from '../models/entity-base';

export interface IVolumeOffer extends IEntityBase {
  cloudstackId: string;
  name: string;
  capacity: number;
}
