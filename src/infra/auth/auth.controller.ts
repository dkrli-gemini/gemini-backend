import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import axios from 'axios';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  private tokenUrl =
    'http://localhost:8080/realms/nestjs-realm/protocol/openid-connect/token';
  private keycloakUrl =
    'http://localhost:8080/realms/nestjs-realm/protocol/openid-connect/auth';
  private clientId = 'gemini-api-client';
  private redirectUri = 'http://localhost:3000/auth/callback';

  @Get('login')
  login(@Res() res: Response) {
    const authUrl = `${this.keycloakUrl}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code`;
    return res.redirect(authUrl);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          code,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const { access_token } = response.data;
      return res.json({ access_token });
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'Failed to exchange code for token' });
    }
  }
}
