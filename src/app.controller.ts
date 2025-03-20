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
import { Request, Response } from 'express';
import { Protected } from './infra/auth/keycloak.guard';
import { IProjectRepository } from './domain/repository/project.respository';
import { IUserRepository } from './domain/repository/user.repository';
import { IProject } from './domain/entities/project';
import { IUser } from './domain/entities/user';
import { IAddProject } from './domain/contracts/use-cases/project/add-project';
import { Secured } from './infra/auth/auth.decorator';
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
  @UseGuards(Protected)
  getProtectedData() {
    return { message: 'authenticated' };
  }
}
