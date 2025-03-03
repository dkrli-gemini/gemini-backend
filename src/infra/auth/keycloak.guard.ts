import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { KeycloakConfigService } from './keycloak.config';
import * as KeycloakConnect from 'keycloak-connect';

@Injectable()
export class Protected implements CanActivate {
  private keycloak: KeycloakConnect.Keycloak;

  constructor(private readonly keycloakConfigService: KeycloakConfigService) {
    this.keycloak = this.keycloakConfigService.getKeycloak();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return new Promise<boolean>((resolve, reject) => {
      this.keycloak.protect()(request, response, (err?: any) => {
        if (err) {
          reject(
            new UnauthorizedException('Unauthorized: Invalid or missing token'),
          );
        } else {
          resolve(true);
        }
      });
    }).catch(() => {
      throw new UnauthorizedException('Unauthorized: Invalid or missing token');
    });
  }
}
