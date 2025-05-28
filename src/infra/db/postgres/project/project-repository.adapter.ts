import { Injectable, Provider } from '@nestjs/common';
import { IDomain } from 'src/domain/entities/domain';
import { IProject, ProjectTypeEnum } from 'src/domain/entities/project';
import { IProjectRepository } from 'src/domain/repository/project.repository';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ProjectRepositoryAdapter implements IProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(project: IProject): Promise<IProject> {
    const created = await this.prisma.projectModel.create({
      data: {
        name: project.name,
        type: project.type,
        domainId: project.domain.id,
      },
      select: {
        id: true,
        name: true,
        type: true,
        domainId: true,
      },
    });

    return {
      id: created.id,
      name: created.name,
      type: created.type as ProjectTypeEnum,
      domain: {
        id: created.domainId,
      } as IDomain,
    };
  }

  async getProject(id: string): Promise<IProject> {
    const project = await this.prisma.projectModel.findUnique({
      where: {
        id,
      },
      include: {
        domain: true,
      },
    });
    console.log(project);
    return this.mapToDomain(project);
  }

  mapToDomain(persistencyObject: any): IProject {
    const project: IProject = {
      id: persistencyObject.id,
      name: persistencyObject.name,
      type: persistencyObject.type,
      domain: {
        id: persistencyObject.domain.id,
        cloudstackDomainId: persistencyObject.domain.cloudstackDomainId,
        name: persistencyObject.domain.name,
      } as IDomain,
    };

    return project;
  }
}

export const ProjectRepositoryProvider: Provider = {
  provide: IProjectRepository,
  useClass: ProjectRepositoryAdapter,
};
