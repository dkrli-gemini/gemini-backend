import { applyDecorators, UseGuards } from '@nestjs/common';
import { KeycloakAuthGuard } from './keycloak.guard';
import { Roles, RolesEnum, RolesGuard } from './roles.guard';

export function AuthorizedTo(...roles: RolesEnum[]) {
  return applyDecorators(
    UseGuards(KeycloakAuthGuard, RolesGuard, Roles(...roles)),
  );
}
