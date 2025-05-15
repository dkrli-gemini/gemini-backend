import { Injectable, Provider } from '@nestjs/common';
import {
  ICreateRootDomain,
  ICreateRootDomainInput,
} from 'src/domain/contracts/use-cases/domain/create-root-domain';
import { IDomain, IDomainType } from 'src/domain/entities/domain';
import { IProject } from 'src/domain/entities/project';
import { IDomainRepository } from 'src/domain/repository/domain.repoitory';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';

@Injectable()
export class CreateRootDomain implements ICreateRootDomain {
  constructor(
    private readonly domainRepository: IDomainRepository,
    private readonly cloudstackService: CloudstackService,
  ) {}

  async execute(input: ICreateRootDomainInput): Promise<IDomain> {
    const accountResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.Account.CreateAccount,
      additionalParams: {
        email: input.accountEmail,
        firstname: 'RootAccount',
        lastname: 'RootAccount',
        password: input.accountPassword,
        username: 'RootAccount',
        account: 'RootAccount', // Remove domainid, created on root
        accounttype: '2', // For domain and account admin
      },
    });

    const domain = await this.domainRepository.createRootDomain(
      {
        name: 'RootDomain',
        type: IDomainType.ROOT, // Alter this
        rootProject: {} as IProject,
        cloudstackAccountId: accountResponse.createaccountresponse.account.id,
      },
      input.ownerId,
    );

    return domain as IDomain;
  }
}

export const CreateRootDomainProvider: Provider = {
  provide: ICreateRootDomain,
  useClass: CreateRootDomain,
};
