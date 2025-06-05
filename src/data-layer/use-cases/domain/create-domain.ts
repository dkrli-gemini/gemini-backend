import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProjectRoleModel } from '@prisma/client';
import {
  ICreateDomain,
  ICreateDomainInput,
} from 'src/domain/contracts/use-cases/domain/create-domain';
import { IDomain, IDomainType } from 'src/domain/entities/domain';
import { ProjectTypeEnum } from 'src/domain/entities/project';
import { IDomainRepository } from 'src/domain/repository/domain.repoitory';
import { IProjectRepository } from 'src/domain/repository/project.repository';
import { IResourceLimitRepository } from 'src/domain/repository/resource-limit.repository';
import {
  CloudstackCommands,
  CloudstackService,
} from 'src/infra/cloudstack/cloudstack';
import { PrismaService } from 'src/infra/db/prisma.service';

@Injectable()
export class CreateDomain implements ICreateDomain {
  private defaultVpcOfferingId: string;
  private defaultZoneId: string;
  private defaultCidr: string;
  private defaultDns1: string;
  private defaultDns2: string;

  constructor(
    private readonly domainRepository: IDomainRepository,
    private readonly projectRepository: IProjectRepository,
    private readonly cloudstackService: CloudstackService,
    private readonly resourceLimitRepository: IResourceLimitRepository,
    private readonly prisma: PrismaService,

    private readonly configService: ConfigService,
  ) {
    this.defaultVpcOfferingId = this.configService.get<string>(
      'CLOUDSTACK_DEFAULT_VPC_OFFERING',
    );
    this.defaultZoneId = this.configService.get<string>(
      'CLOUDSTACK_DEFAULT_ZONE_ID',
    );
    this.defaultCidr = this.configService.get<string>('DEFAULT_CIDR');
    this.defaultDns1 = this.configService.get<string>('DEFAULT_DNS1');
    this.defaultDns2 = this.configService.get<string>('DEFAULT_DNS2');
  }

  async execute(input: ICreateDomainInput): Promise<IDomain> {
    const rootDomain = await this.domainRepository.getDomain(input.rootId);

    const domainParams = {
      name: input.name,
    };
    if (rootDomain.type != IDomainType.ROOT) {
      domainParams['parentdomainid'] = rootDomain.id;
    }
    const domainResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.Domain.CreateDomain,
      additionalParams: domainParams,
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

    const vpcResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.VPC.CreateVPC,
      additionalParams: {
        name: `${input.name}-VPC`,
        cidr: this.defaultCidr,
        vpcofferingid: this.defaultVpcOfferingId,
        zoneid: this.defaultZoneId,
        domainid: domainResponse.createdomainresponse.domain.id,
        account: accountResponse.createaccountresponse.account.name,
        dns1: this.defaultDns1,
        dns2: this.defaultDns2,
      },
    });

    const domain = await this.domainRepository.createDomain(
      {
        id: domainResponse.createdomainresponse.domain.id,
        name: input.name,
        root: {
          id: input.rootId,
        } as IDomain,
        type: IDomainType.PARTNER, // Alter this
        vpc: {
          id: vpcResponse.createvpcresponse.id,
          cidr: this.defaultCidr,
          name: `${input.name}-VPC`,
          dns1: this.defaultDns1,
          dns2: this.defaultDns2,
          state: 'on',
        },
        cloudstackAccountId: accountResponse.createaccountresponse.account.id,
      },
      input.ownerId,
    );

    const resourceLimits =
      await this.resourceLimitRepository.createDefaultResourceLimits(domain.id);
    console.log(resourceLimits);

    const project = await this.projectRepository.createProject({
      name: input.name,
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

export const CreateDomainProvider: Provider = {
  provide: ICreateDomain,
  useClass: CreateDomain,
};
