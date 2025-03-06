import { Injectable, Provider } from '@nestjs/common';
import { RoleModel } from '@prisma/client';
import { IProject } from 'src/domain/entities/project';
import { IProjectRepository } from 'src/domain/repository/project.respository';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ProjectRepositoryAdapter implements IProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(project: IProject, userId: string): Promise<IProject> {
    const projectModel = await this.prisma.projectModel.create({
      data: {
        name: project.name,
        users: {
          create: { role: RoleModel.OWNER, user: { connect: { id: userId } } },
        },
      },
    });

    return this.mapToDomain(projectModel);
  }
  mapToDomain(persistencyObject: any): IProject {
    const project: IProject = {
      id: persistencyObject.id,
      name: persistencyObject.name,
    };
    return project;
  }
}

export const ProjectRepositoryProvider: Provider = {
  provide: IProjectRepository,
  useClass: ProjectRepositoryAdapter,
};
