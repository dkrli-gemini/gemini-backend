import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { Protected } from './infra/auth/keycloak.guard';
import { IProjectRepository } from './domain/repository/project.respository';
import { IUserRepository } from './domain/repository/user.repository';
import { IProject } from './domain/entities/project';
import { IUser } from './domain/entities/user';
import { IAddProject } from './domain/contracts/use-cases/project/add-project';

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

  @Get('test')
  @UseGuards(Protected)
  async createProject(@Req() req: Request) {
    const project = await this.addProjectUseCase.execute({
      name: 'Project Name',
      user: { authId: (req.user as any).sub },
    });

    return project;
  }
}
