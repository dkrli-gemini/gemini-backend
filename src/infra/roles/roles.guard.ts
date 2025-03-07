import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleModel } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PrismaService } from '../db/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token) as any;

    const authId = decoded.sub;
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

    console.log(userId);
    console.log(projectId);

    const hasAccess = await this.prisma.projectUserModel.findFirst({
      where: {
        projectId: projectId,
        userId: userId,
        role: RoleModel.OWNER,
      },
    });

    if (!hasAccess) {
      throw new ForbiddenException('Acesso negado');
    }

    return true;
  }
}
