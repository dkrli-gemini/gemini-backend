import { IRepositoryBase } from '../contracts/repository-base';
import { IDomain } from '../entities/domain';

export abstract class IDomainRepository implements IRepositoryBase<IDomain> {
  abstract createDomain(
    domain: IDomain,
    ownerId: string,
  ): Promise<Partial<IDomain>>;
  abstract createRootDomain(
    domain: Partial<IDomain>,
    ownerId: string,
  ): Promise<Partial<IDomain>>;
  abstract getDomain(id: string): Promise<IDomain>;
  abstract findByOwner(ownerId: string): Promise<IDomain[]>;
  abstract mapToDomain(persistencyObject: any): IDomain;
}
