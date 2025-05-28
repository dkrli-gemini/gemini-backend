import { IRepositoryBase } from '../contracts/repository-base';
import { IResourceLimit } from '../entities/resource-limit';

export abstract class IResourceLimitRepository
  implements IRepositoryBase<IResourceLimit>
{
  abstract createResourceLimit(input: IResourceLimit): Promise<IResourceLimit>;
  abstract getResourceLimit(id: string): Promise<IResourceLimit>;
  abstract listByDomain(domainId: string): Promise<IResourceLimit[]>;
  abstract mapToDomain(persistencyObject: any): IResourceLimit;
}
