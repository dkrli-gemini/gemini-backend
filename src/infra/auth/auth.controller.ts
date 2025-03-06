import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import axios from 'axios';
import { Response, Request } from 'express';
import { IUserRepository } from 'src/domain/repository/user.repository';
import * as jwt_decode from 'jwt-decode';

@Controller('auth')
export class AuthController {
  constructor(private readonly userRepository: IUserRepository) {}

  private tokenUrl =
    'http://localhost:8080/realms/nestjs-realm/protocol/openid-connect/token';
  private keycloakUrl =
    'http://localhost:8080/realms/nestjs-realm/protocol/openid-connect/auth';
  private keycloakLogoutUrl =
    'http://localhost:8080/realms/nestjs-realm/protocol/openid-connect/logout';
  private clientId = 'gemini-api-client';
  private redirectUri = 'http://localhost:3000/auth/callback';
  private redirectUriRegister = 'http://localhost:3000/auth/register-callback';

  @Get('login')
  login(@Res() res: Response) {
    const authUrl = `${this.keycloakUrl}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code`;
    return res.redirect(authUrl);
  }

  @Get('register')
  register(@Res() res: Response) {
    const registerUrl = `${this.keycloakUrl}?client_id=${this.clientId}&redirect_uri=${this.redirectUriRegister}&response_type=code&kc_action=register`;
    return res.redirect(registerUrl);
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    const logoutUrl = `${this.keycloakLogoutUrl}?client_id=${this.clientId}&post_logout_redirect_uri=${this.redirectUri}`;

    return res.redirect(logoutUrl); // Redirect user to Keycloak logout
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

  @Get('register-callback')
  async registerCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const response = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: this.redirectUriRegister,
          code,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      jwt.decode('');

      await this.userRepository.create({
        name: data?.name,
        email: data.email,
        authId: data.sub,
      });
      const { access_token } = response.data;

      return res.json({ access_token });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ error: 'Failed to exchange code for token' });
    }
  }
}
