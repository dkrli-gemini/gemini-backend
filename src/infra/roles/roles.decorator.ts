import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleModel } from '@prisma/client';
import { RolesGuard } from './roles.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleModel[]) => SetMetadata(ROLES_KEY, roles);

export function UserRoles(...roles: RoleModel[]) {
  return applyDecorators(UseGuards(RolesGuard), Roles(...roles));
}
