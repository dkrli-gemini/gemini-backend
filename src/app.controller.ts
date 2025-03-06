import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { Protected } from './infra/auth/keycloak.guard';
import { IProjectRepository } from './domain/repository/project.respository';
import { IUserRepository } from './domain/repository/user.repository';
import { IProject } from './domain/entities/project';
import { IUser } from './domain/entities/user';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly projectRepository: IProjectRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  @Get('protected')
  @UseGuards(Protected)
  getProtectedData() {
    return { message: 'authenticated' };
  }

  @Get('test')
  @UseGuards(Protected)
  async createProject(@Req() req: Request) {
    const user: IUser = await this.userRepository.getUserByAuthId(
      (req.user as any).sub,
    );

    const project: IProject = {
      name: 'Project 2',
    };

    const projectCreated = await this.projectRepository.createProject(
      project,
      user.id as string,
    );

    return {
      projectCreated,
      user,
    };
  }
}
