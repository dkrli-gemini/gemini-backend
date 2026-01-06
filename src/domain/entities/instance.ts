import { IEntityBase } from '../models/entity-base';

export interface IInstance extends IEntityBase {
  name: string;
  memory: string;
  disk: string;
  cpu: string;
  cpuNumber: number;
  cpuSpeedMhz: number;
  memoryInMb: number;
  rootDiskSizeInGb: number;
  sku?: string;
  family?: string;
  profile?: string;
  diskTier?: string;
}
