import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false,
      issuer: configService.get<string>('KEYCLOAK_ISSUER'),
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        jwksUri: configService.get<string>('KEYCLOAK_JWKS_URI') as string,
      }),
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      username: payload.preferred_username,
      roles: payload.realm_access?.roles || [],
      email: payload.email,
    };
  }
}
