import { Controller, Get, Req } from '@nestjs/common';

import {
  CloudstackCommands,
  CloudstackService,
} from './infra/cloudstack/cloudstack';
import { ok } from './domain/contracts/http';
import { KeycloakAuthGuard } from './infra/auth/keycloak.guard';
import { Roles, RolesEnum, RolesGuard } from './infra/auth/roles.guard';
import { AuthorizedTo } from './infra/auth/auth.decorator';
import { IDomainRepository } from './domain/repository/domain.repoitory';
import { ICreateDomain } from './domain/contracts/use-cases/domain/create-domain';
import { IAddNetwork } from './domain/contracts/use-cases/networks/add-network';

@Controller()
export class AppController {
  constructor(
    private readonly cloudstackService: CloudstackService,
    private readonly domainRepository: IDomainRepository,
    private readonly createDomain: ICreateDomain,
    private readonly createNetwork: IAddNetwork,
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
  async getProtectedData(@Req() req) {
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
    const network = await this.createNetwork.execute({
      name: 'Test-Network',
      domainId: '4d4a6e68-bcc1-411c-9f3b-a2ba0e68f98d',
      gateway: '10.128.2.3',
      netmask: '255.255.255.0',
      cloudstackAclId: '022c64eb-fe8d-11ef-ad17-000c2918dc6d',
      cloudstackOfferId: '7c8adb87-e709-465a-a63c-bb33036bd56f',
    });
    return ok(network);
  }
}
