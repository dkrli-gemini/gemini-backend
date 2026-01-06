import { IEntityBase } from '../models/entity-base';
import { IVolumeOffer } from './volume-offer';

export interface IVolume extends IEntityBase {
  name: string;
  offer: IVolumeOffer;
  machineId: string;
  sizeInGb?: number;
}
