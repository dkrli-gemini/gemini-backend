import { Controller, Get, Query, Redirect, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly keycloakSignupUrl =
    'http://localhost:8080/realms/nestjs-realm/protocol/openid-connect/registrations?client_id=gemini-api-client&response_type=code&scope=openid&redirect_uri=http://localhost:3000/auth/callback';

  @Get('sign-up')
  @Redirect()
  signup() {
    return { url: this.keycloakSignupUrl };
  }

  @Get('callback')
  async callback(@Query() query, @Req() req: Request, @Res() res: Response) {
    const { code, error } = query;
    console.log(code);

    if (error) {
      console.log('Auth error: ', error);
      return res.status(400).send('Auth error');
    }

    if (!code) {
      return res.status(400).send('Auth code not received');
    }
  }

  @Get('logout')
  @Redirect()
  logout(@Res() res: Response) {
    const keycloakLogoutUrl =
      'http://localhost:8080/realms/nestjs-realm/protocol/openid-connect/logout?redirect_uri=http://localhost:3000/';

    return { url: keycloakLogoutUrl };
  }
}
