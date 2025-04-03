import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  private defaultVpcOfferingId: string;
  private defaultZoneId: string;
  private defaultCidr: string;
  private defaultDns1: string;
  private defaultDns2: string;

  constructor(
    private readonly domainRepository: IDomainRepository,
    private readonly cloudstackService: CloudstackService,
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
        name: input.name,
        vpc: {
          cidr: this.defaultCidr,
          name: `${input.name}-VPC`,
          cloudstackId: vpcResponse.createvpcresponse.id,
          dns1: this.defaultDns1,
          dns2: this.defaultDns2,
          state: 'on',
        },
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
