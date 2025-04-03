import { Injectable, Provider } from '@nestjs/common';
import { IDomain } from 'src/domain/entities/domain';
import { IProject } from 'src/domain/entities/project';
import { IProjectRepository } from 'src/domain/repository/project.repository';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ProjectRepositoryAdapter implements IProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getProject(id: string): Promise<IProject> {
    const project = await this.prisma.projectModel.findUnique({
      where: {
        id,
      },
      include: {
        DomainModel: true,
      },
    });

    return this.mapToDomain(project);
  }
  mapToDomain(persistencyObject: any): IProject {
    const project: IProject = {
      id: persistencyObject.id,
      name: persistencyObject.name,
      type: persistencyObject.type,
      domain: {
        id: persistencyObject.DomainModel[0].id,
        cloudstackDomainId: persistencyObject.DomainModel[0].cloudstackDomainId,
        name: persistencyObject.DomainModel[0].name,
      } as IDomain,
    };

    return project;
  }
}

export const ProjectRepositoryProvider: Provider = {
  provide: IProjectRepository,
  useClass: ProjectRepositoryAdapter,
};
