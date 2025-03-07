import { SetMetadata } from '@nestjs/common';
import { RoleModel } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleModel[]) => SetMetadata(ROLES_KEY, roles);
