import {
  Body,
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

import {
  CloudstackCommands,
  CloudstackService,
} from './infra/cloudstack/cloudstack';
import { ok } from './domain/contracts/http';
import { KeycloakAuthGuard } from './infra/auth/keycloak.guard';
import { Roles, RolesGuard } from './infra/auth/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly cloudstackService: CloudstackService) {}

  @Get('list-machines')
  async listMachines() {
    const response = await this.cloudstackService.handle({
      command: CloudstackCommands.ListVirtualMachines,
    });

    return ok(response);
  }

  @UseGuards(KeycloakAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('protected')
  async getProtectedData(@Req() req) {
    return { message: 'authenticated' };
  }
}
