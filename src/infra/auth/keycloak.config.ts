import { Injectable } from '@nestjs/common';
import * as KeycloakConnect from 'keycloak-connect'; 

import * as session from 'express-session';

@Injectable()
export class KeycloakConfigService {
  private keycloak: KeycloakConnect.Keycloak;

  constructor() {
    const memoryStore = new session.MemoryStore();

    this.keycloak = new KeycloakConnect(
      { store: memoryStore },
      {
        realm: 'nestjs-realm',
        'auth-server-url': 'http://localhost:8080', // Change to your Keycloak URL
        'ssl-required': 'external',
        resource: 'gemini-api-client',
        'confidential-port': 0,
      },
    );
  }

  getKeycloak() {
    return this.keycloak;
  }
}
