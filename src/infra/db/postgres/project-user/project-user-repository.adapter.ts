import { Injectable, Provider } from '@nestjs/common';
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
    console.log(projectUser);
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
        role: projectUser.role,
      },
    });

    return this.mapToDomain(projectUserModel);
  }

  async getProjectUsers(projectId: string): Promise<IProjectUser[]> {
    const projectUsers = await this.prisma.projectUserModel.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        user: true,
      },
    });

    let result = projectUsers.map((user) => {
      return this.mapToDomain(user);
    });
    return result;
  }

  mapToDomain(persistencyObject: any): IProjectUser {
    console.log(persistencyObject);

    const projectUser: IProjectUser = {
      id: persistencyObject.id,
      project: { id: persistencyObject.projectId } as IProject,
      user: {
        id: persistencyObject.userId,
        email: persistencyObject.user.email ?? null,
        name: persistencyObject.user.name ?? null,
      } as IUser,
      role: persistencyObject.role,
    };

    return projectUser as IProjectUser;
  }
}

export const ProjectUserRepositoryProvider: Provider = {
  provide: IProjectUserRepository,
  useClass: ProjectUserRepositoryAdapter,
};
