import {
  IDomain,
  IDomainType,
  OrganizationBillingType,
} from 'src/domain/entities/domain';
import { IUseCase } from '../../use-case';

export interface ICreateDomainInput {
  name: string;
  ownerId: string;
  accountEmail: string;
  accountPassword: string;
  rootId: string;
  billingType?: OrganizationBillingType;
  type?: IDomainType;
  isDistributor?: boolean;
}

export type ICreateDomainOutput = IDomain;

export abstract class ICreateDomain
  implements IUseCase<ICreateDomainInput, ICreateDomainOutput>
{
  abstract execute(input: ICreateDomainInput): Promise<IDomain>;
}
