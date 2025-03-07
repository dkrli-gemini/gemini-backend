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

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly addProjectUseCase: IAddProject,
  ) {}

  @Get('protected')
  @UseGuards(Protected)
  getProtectedData() {
    return { message: 'authenticated' };
  }

  @Get('test/:id')
  @UseGuards(Protected)
  @UseGuards(RolesGuard)
  async createProject(@Param('id') id: string, @Req() req: Request) {
    return {
      message: 'accessed!',
      user: (req.user as any).sub,
    };
  }
}
