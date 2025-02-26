import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { KeycloakConfigService } from './keycloak.config';
import * as KeycloakConnect from 'keycloak-connect';

@Injectable()
export class Protected implements CanActivate {
  private keycloak: KeycloakConnect.Keycloak;

  constructor(private readonly keycloakConfigService: KeycloakConfigService) {
    this.keycloak = this.keycloakConfigService.getKeycloak(); // ✅ Proper way to get Keycloak instance
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return new Promise<boolean>((resolve, reject) => {
      this.keycloak.protect()(request, response, (err?: any) => {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
