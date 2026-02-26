import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import * as Keycloak from 'keycloak-connect';
import { KeycloakAuthGuard } from './keycloak.guard';
import { KeycloakController } from './keycloak.controller';
import { KeycloakService } from './keycloak.service';

@Global()
@Module({
  providers: [
    KeycloakService,
    Reflector,
    {
      provide: 'KEYCLOAK_INSTANCE',
      useFactory: () => {
        return new Keycloak({}, './keycloak.json');
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
  exports: ['KEYCLOAK_INSTANCE', KeycloakService],
  controllers: [KeycloakController],
})
export class AuthModule {}
