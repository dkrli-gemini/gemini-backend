import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { KeycloakAuthGuard } from './keycloak.guard';
import { Roles, RolesEnum, RolesGuard } from './roles.guard';

export function AuthorizedTo(...roles: RolesEnum[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(KeycloakAuthGuard, RolesGuard),
  );
}
