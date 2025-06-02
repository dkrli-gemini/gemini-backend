import { IRepositoryBase } from '../contracts/repository-base';
import { IVolume } from '../entities/volume';

export abstract class IVolumeRepository implements IRepositoryBase<IVolume> {
  abstract createVolume(input: Partial<IVolume>): Promise<IVolume>;
  abstract listVolumesByMachine(machineId: string): Promise<IVolume[]>;
  abstract mapToDomain(persistencyObject: any): IVolume;
}
