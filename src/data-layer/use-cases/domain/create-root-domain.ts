import { Injectable, Provider } from '@nestjs/common';
import { ProjectRoleModel } from '@prisma/client';
import {
  ICreateRootDomain,
  ICreateRootDomainInput,
} from 'src/domain/contracts/use-cases/domain/create-root-domain';
import { IDomain, IDomainType } from 'src/domain/entities/domain';
import { ProjectTypeEnum } from 'src/domain/entities/project';
import { IDomainRepository } from 'src/domain/repository/domain.repoitory';
import { IProjectRepository } from 'src/domain/repository/project.repository';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';

@Injectable()
export class CreateRootDomain implements ICreateRootDomain {
  constructor(
    private readonly domainRepository: IDomainRepository,
    private readonly projectRepository: IProjectRepository,
    private readonly prisma: PrismaService,

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
        cloudstackAccountId: accountResponse.createaccountresponse.account.id,
      },
      input.ownerId,
    );

    const project = await this.projectRepository.createProject({
      name: 'RootProject',
      type: ProjectTypeEnum.ROOT,
      domain: {
        id: domain.id,
      } as IDomain,
    });

    await this.prisma.domainMemberModel.create({
      data: {
        role: ProjectRoleModel.OWNER,
        projectModelId: project.id,
        userId: input.ownerId,
      },
    });

    return domain as IDomain;
  }
}

export const CreateRootDomainProvider: Provider = {
  provide: ICreateRootDomain,
  useClass: CreateRootDomain,
};
