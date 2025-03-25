import {
  Body,
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

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

  @AuthorizedTo(RolesEnum.BASIC)
  @Get('protected')
  async getProtectedData(@Req() req) {
    const result = await this.createDomain.execute({
      cloudstackAccountId: 'accountid',
      cloudstackDomainId: 'domainid',
      name: 'name',
      ownerId: 'dbae6e8d-7e30-413e-9f6e-4406b983fd10',
    });

    return result;
  }
}
