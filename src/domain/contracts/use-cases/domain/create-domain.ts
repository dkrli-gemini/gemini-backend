import { IDomain, OrganizationBillingType } from 'src/domain/entities/domain';
import { IUseCase } from '../../use-case';

export interface ICreateDomainInput {
  name: string;
  ownerId: string;
  accountEmail: string;
  accountPassword: string;
  rootId: string;
  billingType?: OrganizationBillingType;
}

export type ICreateDomainOutput = IDomain;

export abstract class ICreateDomain
  implements IUseCase<ICreateDomainInput, ICreateDomainOutput>
{
  abstract execute(input: ICreateDomainInput): Promise<IDomain>;
}
