import { IRepositoryBase } from '../contracts/repository-base';
import { IInstance } from '../entities/instance';

export abstract class IInstanceRepository
  implements IRepositoryBase<IInstance>
{
  abstract createInstance(instance: Partial<IInstance>): Promise<IInstance>;
  abstract getInstance(id: string): Promise<IInstance>;
  abstract listInstances(): Promise<IInstance[]>;
  abstract mapToDomain(persistencyObject: any): IInstance;
}
