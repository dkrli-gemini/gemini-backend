import { Injectable } from '@nestjs/common';
import KeycloakConnect from 'keycloak-connect';

@Injectable()
export class KeycloakConfigService {
  private keycloak: KeycloakConnect.Keycloak;
}
