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

  @Get('protected')
  getProtectedData() {
    return { message: 'authenticated' };
  }
}
