import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Request, Response } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('secured')
  @UseGuards(AuthGuard('keycloak'))
  getSecuredData(@Req() req) {
    return {
      message: 'secured data!',
      user: req.user,
    };
  }

  @Get('login')
  @UseGuards(AuthGuard('keycloak'))
  login() {
    return;
  }

  // Handles Keycloak OAuth callback
  @Get('callback')
  @UseGuards(AuthGuard('keycloak'))
  async callback(@Req() req, @Res() res) {
    const user = req.user;
    res.json({
      message: 'Login successful!',
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      user,
    });
  }
}
