import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authId = (request.user as any).sub;
    if (!authId) {
      throw new ForbiddenException('User not authenticated');
    }

    const projectId = request.params.id;
    if (!projectId) {
      throw new ForbiddenException('Project ID not found');
    }

    const userId = (
      await this.prisma.userModel.findFirst({
        where: {
          authId: authId,
        },
      })
    ).id;
    const hasAccess = await this.prisma.projectUserModel.findFirst({
      where: {
        projectId: projectId,
        userId: userId,
      },
    });

    if (!hasAccess) {
      throw new ForbiddenException('Acesso negado');
    }

    return true;
  }
}
