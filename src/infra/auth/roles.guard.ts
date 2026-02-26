import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum RolesEnum {
  ADMIN = 'admin',
  BASIC = 'basic',
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User roles are missing');
    }

    const realmRoles: string[] = Array.isArray(user.roles) ? user.roles : [];
    const clientRoles: string[] = Array.isArray(user.clientRoles)
      ? user.clientRoles
      : [];
    const allRoles = new Set(
      [...realmRoles, ...clientRoles]
        .filter((role) => typeof role === 'string')
        .map((role) => role.toLowerCase()),
    );
    const requiredRoles = roles.map((role) => role.toLowerCase());
    const allowsBasic = requiredRoles.includes(RolesEnum.BASIC);
    const requiresAdminOnly =
      requiredRoles.includes(RolesEnum.ADMIN) && !allowsBasic;

    // Backward compatibility: routes that allow BASIC should not hard-fail
    // when legacy users are authenticated but still missing synced realm roles.
    if (!requiresAdminOnly && user?.id) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => allRoles.has(role));
    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
