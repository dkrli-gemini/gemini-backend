import { IDomain } from 'src/domain/entities/domain';
import { IUseCase } from '../../use-case';

export class ICreateRootDomainInput {
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerUsername?: string;
  accountName?: string;
  accountEmail: string;
  accountPassword: string;
}

export type ICreateRootDomainOutput = IDomain;

export abstract class ICreateRootDomain
  implements IUseCase<ICreateRootDomainInput, ICreateRootDomainOutput>
{
  abstract execute(input: ICreateRootDomainInput): Promise<IDomain>;
}
