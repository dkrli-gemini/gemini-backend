import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-keycloak-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakOAuthStrategy extends PassportStrategy(
  Strategy,
  'keycloak',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('KEYCLOAK_CLIENT_ID'),
      clientSecret: configService.get<string>('KEYCLOAK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KEYCLOAK_CALLBACK_URL'),
      authorizationURL: `${configService.get<string>('KEYCLOAK_URL')}/realms/${configService.get<string>('KEYCLOAK_REALM')}/protocol/openid-connect/auth`,
      tokenURL: `${configService.get<string>('KEYCLOAK_URL')}/realms/${configService.get<string>('KEYCLOAK_REALM')}/protocol/openid-connect/token`,
      userInfoURL: `${configService.get<string>('KEYCLOAK_URL')}/realms/${configService.get<string>('KEYCLOAK_REALM')}/protocol/openid-connect/userinfo`,
      scope: ['openid', 'profile', 'email'],
      pkce: true, // Enable PKCE for better security
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      accessToken,
      refreshToken,
      profile,
    };
  }
}
