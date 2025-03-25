import { IDomain } from 'src/domain/entities/domain';
import { IUseCase } from '../../use-case';

export interface ICreateDomainInput {
  name: string;
  cloudstackDomainId: string;
  cloudstackAccountId: string;
  ownerId: string;
  accountEmail: string;
  accountPassword: string;
}

export type ICreateDomainOutput = IDomain;

export abstract class ICreateDomain
  implements IUseCase<ICreateDomainInput, ICreateDomainOutput>
{
  abstract execute(input: ICreateDomainInput): Promise<IDomain>;
}
