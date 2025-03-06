import { Injectable } from '@nestjs/common';
import { ProjectUserModel, RoleModel } from '@prisma/client';
import { User } from 'src/data-layer/models/user';
import { IProject } from 'src/domain/entities/project';
import { IProjectUser } from 'src/domain/entities/project-user';
import { IUser } from 'src/domain/entities/user';
import { IProjectUserRepository } from 'src/domain/repository/project-user.repository';
import { IUserRepository } from 'src/domain/repository/user.repository';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ProjectUserRepositoryAdapter implements IProjectUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createProjectUser(projectUser: IProjectUser): Promise<IProjectUser> {
    const projectUserModel = await this.prisma.projectUserModel.create({
      data: {
        user: {
          connect: { id: projectUser.user.id },
        },
        project: {
          connect: {
            id: projectUser.project.id,
          },
        },
        role: RoleModel.OWNER,
      },
    });

    return this.mapToDomain(projectUserModel);
  }

  mapToDomain(persistencyObject: any): IProjectUser {
    const projectUser: IProjectUser = {
      project: { id: persistencyObject.projectId } as IProject,
      user: { id: persistencyObject.userId } as IUser,
      role: persistencyObject.role,
    };

    return projectUser;
  }
}
