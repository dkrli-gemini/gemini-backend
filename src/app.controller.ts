import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('secured')
  @UseGuards(AuthGuard('keycloak'))
  getSecuredData(@Request() req) {
    return {
      message: 'secured data!',
      user: req.user,
    };
  }
}
