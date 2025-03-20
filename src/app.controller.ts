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
import { RolesGuard } from './infra/roles/roles.guard';
import { Roles, UserRoles } from './infra/roles/roles.decorator';
import { RoleModel } from '@prisma/client';
import { Secured } from './infra/auth/auth.decorator';
import {
  CloudstackCommands,
  CloudstackService,
} from './infra/cloudstack/cloudstack';
import { ok } from './domain/contracts/http';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly addProjectUseCase: IAddProject,
    private readonly cloudstackService: CloudstackService,
  ) {}

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

  @Get('test/:id')
  @Secured()
  @UserRoles(RoleModel.ADMIN, RoleModel.OWNER)
  async createProject(@Param('id') id: string, @Req() req: Request) {
    return {
      message: 'accessed!',
      user: (req.user as any).sub,
    };
  }
}
