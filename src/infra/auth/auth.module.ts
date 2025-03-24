import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import * as Keycloak from 'keycloak-connect';
import { KeycloakAuthGuard } from './keycloak.guard';

@Module({
  providers: [
    Reflector,
    {
      provide: 'KEYCLOAK_INSTANCE',
      useFactory: () => {
        return new Keycloak({}, './keycloak.json'); // Ensure path is correct
      },
    },
    {
      provide: APP_GUARD,
      useClass: KeycloakAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: ['KEYCLOAK_INSTANCE'], // Add this line
})
export class AuthModule {}
