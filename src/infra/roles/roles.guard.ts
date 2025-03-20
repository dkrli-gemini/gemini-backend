// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { RoleModel } from '@prisma/client';
// import { Request } from 'express';
// import { PrismaService } from '../db/prisma.service';
// import * as jwt from 'jsonwebtoken';
// import { ROLES_KEY } from './roles.decorator';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly prisma: PrismaService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request: Request = context.switchToHttp().getRequest();
//     const authHeader = request.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException('Missing or invalid token');
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.decode(token) as any;

//     const authId = decoded.sub;
//     if (!authId) {
//       throw new ForbiddenException('User not authenticated');
//     }

//     const projectId = request.params.id;
//     if (!projectId) {
//       throw new ForbiddenException('Project ID not found');
//     }

//     const requiredRoles = this.reflector.get<RoleModel[]>(
//       ROLES_KEY,
//       context.getHandler(),
//     );

//     const hasAccess = await this.prisma.projectUserModel.findFirst({
//       where: {
//         projectId: projectId,
//         userId: authId,
//         role: { in: requiredRoles },
//       },
//     });

//     if (!hasAccess) {
//       throw new ForbiddenException('Acesso negado');
//     }

//     return true;
//   }
// }
