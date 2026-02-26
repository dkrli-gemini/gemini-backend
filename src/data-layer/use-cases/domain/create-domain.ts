import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProjectRoleModel, ProjectTypeModel } from '@prisma/client';
import {
  ICreateDomain,
  ICreateDomainInput,
} from 'src/domain/contracts/use-cases/domain/create-domain';
import {
  IDomain,
  IDomainType,
  OrganizationBillingType,
} from 'src/domain/entities/domain';
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
    const accountResponse = await this.cloudstackService.handle({
      command: CloudstackCommands.Account.CreateAccount,
      additionalParams: {
        email: input.accountEmail,
        firstname: input.name,
        lastname: input.name,
        password: input.accountPassword,
        username: input.name,
        account: input.name,
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
        account: accountResponse.createaccountresponse.account.name,
        domainid: accountResponse.createaccountresponse.account.domainid,
        dns1: this.defaultDns1,
        dns2: this.defaultDns2,
      },
    });

    const domain = await this.domainRepository.createDomain(
      {
        name: input.name,
        root: {
          id: input.rootId,
        } as IDomain,
        type: input.type ?? IDomainType.PARTNER,
        isDistributor:
          input.isDistributor ?? (input.type ?? IDomainType.PARTNER) !== IDomainType.CLIENT,
        vpc: {
          id: vpcResponse.createvpcresponse.id,
          cidr: this.defaultCidr,
          name: `${input.name}-VPC`,
          dns1: this.defaultDns1,
          dns2: this.defaultDns2,
          state: 'on',
        },
        cloudstackAccountId: accountResponse.createaccountresponse.account.id,
        billingType: input.billingType ?? OrganizationBillingType.POOL,
      },
    );

    const resourceLimits =
      await this.resourceLimitRepository.createDefaultResourceLimits(domain.id);
    console.log(resourceLimits);

    const project = await this.ensureDefaultProject(domain.id, input.name);
    await this.ensureOwnerMembership(project.id, input.ownerId);
    return domain as IDomain;
  }

  private async ensureDefaultProject(
    domainId: string,
    fallbackName: string,
  ): Promise<{ id: string }> {
    const existingProject = await this.prisma.projectModel.findFirst({
      where: {
        domainId,
        type: ProjectTypeModel.ROOT,
      },
      select: { id: true },
    });

    if (existingProject) {
      return existingProject;
    }

    const createdProject = await this.projectRepository.createProject({
      name: `${fallbackName}-default`,
      type: ProjectTypeEnum.ROOT,
      domain: {
        id: domainId,
      } as IDomain,
    });

    return { id: createdProject.id };
  }

  private async ensureOwnerMembership(
    projectId: string,
    ownerId: string,
  ): Promise<void> {
    const existingMembership = await this.prisma.domainMemberModel.findFirst({
      where: {
        projectModelId: projectId,
        userId: ownerId,
      },
      select: { id: true, role: true },
    });

    if (!existingMembership) {
      await this.prisma.domainMemberModel.create({
        data: {
          role: ProjectRoleModel.OWNER,
          projectModelId: projectId,
          userId: ownerId,
        },
      });
      return;
    }

    if (existingMembership.role !== ProjectRoleModel.OWNER) {
      await this.prisma.domainMemberModel.update({
        where: { id: existingMembership.id },
        data: { role: ProjectRoleModel.OWNER },
      });
    }
  }
}

export const CreateDomainProvider: Provider = {
  provide: ICreateDomain,
  useClass: CreateDomain,
};
