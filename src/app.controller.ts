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

@Controller()
export class AppController {
  constructor(
    private readonly cloudstackService: CloudstackService,
    private readonly domainRepository: IDomainRepository,
    private readonly createDomain: ICreateDomain,
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
    const result = await this.domainRepository.findByOwner(req.user.id);
    console.log('ID:', result[0].cloudstackDomainId);
    const machines = await this.cloudstackService.handle({
      command: CloudstackCommands.VirtualMachine.ListVirtualMachines,
      additionalParams: {
        domainid: result[1].cloudstackDomainId,
      },
    });
    console.log(machines);
    return machines;
  }
}
