import { Injectable, Provider } from '@nestjs/common';
import {
  ICreateDomain,
  ICreateDomainInput,
} from 'src/domain/contracts/use-cases/domain/create-domain';
import { IDomain } from 'src/domain/entities/domain';
import { IProject } from 'src/domain/entities/project';
import { IDomainRepository } from 'src/domain/repository/domain.repoitory';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';

@Injectable()
export class CreateDomain implements ICreateDomain {
  constructor(
    private readonly domainRepository: IDomainRepository,
    private readonly cloudstackService: CloudstackService,
  ) {}

  async execute(input: ICreateDomainInput): Promise<IDomain> {
    const domainResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.Domain.CreateDomain,
      additionalParams: {
        name: input.name,
      },
    });

    const accountResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.Account.CreateAccount,
      additionalParams: {
        email: input.accountEmail,
        firstname: input.name,
        lastname: input.name,
        password: input.accountPassword,
        username: input.name,
        account: input.name,
        domainid: domainResponse.createdomainresponse.domain.id,
        accounttype: '2', // For domain and account admin
      },
    });

    console.log(accountResponse);
    console.log(domainResponse);

    const domain = await this.domainRepository.createDomain(
      {
        name: input.name,
        rootProject: {} as IProject,
        cloudstackAccountId: accountResponse.createaccountresponse.account.id,
        cloudstackDomainId: domainResponse.createdomainresponse.domain.id,
      },
      input.ownerId,
    );
    return domain;
  }
}

export const CreateDomainProvider: Provider = {
  provide: ICreateDomain,
  useClass: CreateDomain,
};
