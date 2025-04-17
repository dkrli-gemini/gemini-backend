import { Controller, Get } from '@nestjs/common';

import {
  CloudstackCommands,
  CloudstackService,
} from './infra/cloudstack/cloudstack';
import { ok } from './domain/contracts/http';
import { RolesEnum } from './infra/auth/roles.guard';
import { AuthorizedTo } from './infra/auth/auth.decorator';
import { IDomainRepository } from './domain/repository/domain.repoitory';
import { ICreateDomain } from './domain/contracts/use-cases/domain/create-domain';
import { IAddNetwork } from './domain/contracts/use-cases/networks/add-network';
import { IProjectRepository } from './domain/repository/project.repository';
import { IAddVirtualMachine } from './domain/contracts/use-cases/project/add-virtual-machine';

@Controller()
export class AppController {
  constructor(
    private readonly cloudstackService: CloudstackService,
    private readonly domainRepository: IDomainRepository,
    private readonly createDomain: ICreateDomain,
    private readonly createNetwork: IAddNetwork,
    private readonly projectRepository: IProjectRepository,
    private readonly addVM: IAddVirtualMachine,
  ) {}

  @Get('list-machines')
  async listMachines() {
    const response = await this.cloudstackService.handle({
      command: CloudstackCommands.VirtualMachine.ListVirtualMachines,
    });

    return ok(response);
  }

  @Get('protected')
  @AuthorizedTo(RolesEnum.ADMIN)
  async getProtectedData() {
    const data = await this.cloudstackService.handle({
      command: 'listVPCOfferings',
    });
    return data;

    // const machines = await this.cloudstackService.handle({
    //   command: 'deployVirtualMachine',
    //   additionalParams: {
    //     serviceofferingid: 'a3490a4c-2213-4636-86f1-c021e7da9bea',
    //     templateid: 'f014cdff-5c6f-4d29-a9fd-72f01ea05505',
    //     zoneid: '649f8516-bda4-4523-ba00-b236cd97d953',
    //     domainid: 'b9efa435-845a-4241-8b82-c4e0a8c71c35',
    //     account: 'Test-Client',
    //   },
    // });
    // const machines = await this.cloudstackService.handle({
    //   command: 'listNetworkOfferings',
    // });
    // return machines;
    // const network = await this.createNetwork.execute({
    //   name: 'Test-Network',
    //   domainId: '4d4a6e68-bcc1-411c-9f3b-a2ba0e68f98d',
    //   gateway: '10.128.2.3',
    //   netmask: '255.255.255.0',
    //   cloudstackAclId: '022c64eb-fe8d-11ef-ad17-000c2918dc6d',
    //   cloudstackOfferId: '7c8adb87-e709-465a-a63c-bb33036bd56f',
    // });
    // return ok(network);]
    // const project = await this.addVM.execute({
    //   name: 'TestVM029',
    //   projectId: '0e9a1009-bce5-4d05-9761-b35e09acb8fa',
    //   cloudstackOfferId: 'a3490a4c-2213-4636-86f1-c021e7da9bea',
    //   cloudstackTemplateId: '625fdb7e-fe8c-11ef-ad17-000c2918dc6d',
    //   networkId: '37db46d5-362b-4199-bb53-fff55119f7b3',
    // });
    // return project;
    // const test = await this.cloudstackService.handle({
    //   command: 'listTemplates',
    //   additionalParams: {
    //     templatefilter: 'all',
    //     id: '625fdb7e-fe8c-11ef-ad17-000c2918dc6d',
    //   },
    // });
    // console.log(test);
  }
}
