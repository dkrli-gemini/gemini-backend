import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { User } from 'src/data-layer/models/user';
import { IProjectUser } from 'src/domain/entities/project-user';
import { IUser } from 'src/domain/entities/user';
import { IProjectUserRepository } from 'src/domain/repository/project-user.repository';
import { IUserRepository } from 'src/domain/repository/user.repository';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ProjectUserRepositoryAdapter implements IProjectUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  createProjectUser(projectUser: IProjectUser): Promise<IProjectUser> {
    return this.prisma.projectUserModel.create({
      data: {
        user: {
          connect: { id: projectUser.user.id },
        },
        projec
      },
    });
  }

  mapToDomain(persistencyObject: any): IProjectUser {
    throw new Error('Method not implemented.');
  }
}
