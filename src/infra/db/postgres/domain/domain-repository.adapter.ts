import { Injectable, Provider } from '@nestjs/common';
import { ProjectRoleModel, ProjectTypeModel } from '@prisma/client';
import { IDomain } from 'src/domain/entities/domain';
import { IDomainRepository } from 'src/domain/repository/domain.repoitory';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class DomainRepositoryAdapter implements IDomainRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createDomain(domain: IDomain, ownerId: string): Promise<IDomain> {
    const result = await this.prismaService.domainModel.create({
      data: {
        cloudstackDomainId: domain.cloudstackDomainId,
        cloudstackAccountId: domain.cloudstackAccountId,
        name: domain.name,

        rootProject: {
          create: {
            name: 'root',
            type: ProjectTypeModel.ROOT,
            DomainMemberModel: {
              create: {
                role: ProjectRoleModel.OWNER,
                user: {
                  connect: {
                    id: ownerId,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        rootProject: true,
      },
    });

    return this.mapToDomain(result);
  }
  mapToDomain(persistencyObject: any): IDomain {
    const domain: IDomain = {
      id: persistencyObject.id,
      cloudstackDomainId: persistencyObject.cloudstackDomainId,
      cloudstackAccountId: persistencyObject.cloudstackAccountId,
      name: persistencyObject.name,
      rootProject: {
        name: persistencyObject.rootProject.name,
        type: persistencyObject.rootProject.type,
        id: persistencyObject.rootProject.id,
      },
    };

    return domain;
  }
}

export const DomainRepositoryProvider: Provider = {
  provide: IDomainRepository,
  useClass: DomainRepositoryAdapter,
};
