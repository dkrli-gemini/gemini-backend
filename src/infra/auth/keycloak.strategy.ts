import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor(private readonly configService: ConfigService) {
    super({
      authorizationURL: `${configService.get<string>('KEYCLOAK_URL')}/realms/${configService.get<string>('KEYCLOAK_REALM')}/protocol/openid-connect/auth`,
      tokenURL: `${configService.get<string>('KEYCLOAK_URL')}/realms/${configService.get<string>('KEYCLOAK_REALM')}/protocol/openid-connect/token`,
      clientID: configService.get<string>('KEYCLOAK_CLIENT_ID'),
      clientSecret: configService.get<string>('KEYCLOAK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KEYCLOAK_CALLBACK_URL'),
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    try {
      const { data } = await axios.get(
        `${this.configService.get<string>('KEYCLOAK_URL')}/realms/${this.configService.get<string>('KEYCLOAK_REALM')}/protocol/openid-connect/userinfo`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const user = {
        accessToken,
        refreshToken,
        id: data.sub,
        username: data.preferred_username,
        email: data.email,
        firstName: data.given_name,
        lastName: data.family_name,
      };

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
