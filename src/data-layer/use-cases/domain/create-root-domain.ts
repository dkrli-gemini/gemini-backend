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
    const rootAccountName = input.accountName?.trim() || 'RootAccount';
    const ownerId = input.ownerId;

    if (!ownerId) {
      throw new Error(
        'ownerId não informado. Faça login e tente novamente, ou envie ownerId explicitamente.',
      );
    }

    const accountResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.Account.CreateAccount,
      additionalParams: {
        email: input.accountEmail,
        firstname: rootAccountName,
        lastname: rootAccountName,
        password: input.accountPassword,
        username: rootAccountName,
        account: rootAccountName, // Remove domainid, created on root
        accounttype: '2', // For domain and account admin
      },
    });

    const cloudstackAccountId = this.extractCreatedAccountId(accountResponse);

    const domain = await this.domainRepository.createRootDomain({
      name: 'RootDomain',
      type: IDomainType.ROOT, // Alter this
      isDistributor: true,
      cloudstackAccountId,
    });

    const project = await this.projectRepository.createProject({
      name: 'RootProject',
      type: ProjectTypeEnum.ROOT,
      domain: {
        id: domain.id,
      } as IDomain,
    });

    await this.ensureOwnerUser(
      ownerId,
      input.ownerName ?? rootAccountName,
      input.ownerEmail ?? input.accountEmail,
    );

    await this.prisma.domainMemberModel.create({
      data: {
        role: ProjectRoleModel.OWNER,
        projectModelId: project.id,
        userId: ownerId,
      },
    });

    return domain as IDomain;
  }

  private extractCreatedAccountId(response: any): string {
    const accountId = response?.createaccountresponse?.account?.id;
    if (accountId) {
      return accountId;
    }

    const cloudstackError =
      response?.createaccountresponse?.errortext ||
      response?.errorresponse?.errortext ||
      response?.error?.response?.data?.errorresponse?.errortext ||
      response?.error?.message ||
      'Unknown CloudStack error';

    throw new Error(
      `CloudStack account creation failed for root domain: ${cloudstackError}`,
    );
  }

  private async ensureOwnerUser(
    ownerId: string,
    ownerName: string,
    ownerEmail: string,
  ): Promise<void> {
    const existingUser = await this.prisma.userModel.findUnique({
      where: { id: ownerId },
      select: { id: true },
    });

    if (existingUser) {
      return;
    }

    await this.prisma.userModel.create({
      data: {
        id: ownerId,
        name: ownerName,
        email: ownerEmail,
      },
    });
  }
}

export const CreateRootDomainProvider: Provider = {
  provide: ICreateRootDomain,
  useClass: CreateRootDomain,
};
