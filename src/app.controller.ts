import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { Protected } from './infra/auth/keycloak.guard';
import { IProjectRepository } from './domain/repository/project.respository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly projectRepository: IProjectRepository,
  ) {}

  @Get('protected')
  @UseGuards(Protected)
  getProtectedData() {
    return { message: 'authenticated' };
  }

  @Get('test')
  @UseGuards(Protected)
  createProject(@Req() req: Request) {
    console.log(req.user as any);
  }
}
