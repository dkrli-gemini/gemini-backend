import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer: 'http://localhost:8080/realms/nestjs-realm',
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        jwksUri:
          'http://localhost:8080/realms/nestjs-realm/protocol/openid-connect/certs',
      }),
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      username: payload.preferred_username,
      roles: payload.realm_access?.roles || [],
    };
  }
}
