import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { KeycloakAuthGuard } from './keycloak.guard';
import { RolesEnum, RolesGuard } from './roles.guard';

export function AuthorizedTo(...roles: RolesEnum[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(KeycloakAuthGuard, RolesGuard),
  );
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
