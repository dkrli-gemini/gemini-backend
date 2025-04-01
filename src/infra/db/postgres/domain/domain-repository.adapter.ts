import { Injectable, Provider } from '@nestjs/common';
import { ProjectRoleModel, ProjectTypeModel } from '@prisma/client';
import { map, mapTo } from 'rxjs';
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
        vpc: {
          create: {
            cidr: domain.vpc.cidr,
            cloudstackId: domain.vpc.cloudstackId,
            dns1: domain.vpc.dns1,
            dns2: domain.vpc.dns2,
            name: domain.vpc.name,
            state: domain.vpc.state,
          },
        },
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
        vpc: true
      },
    });

    return this.mapToDomain(result);
  }

  async findByOwner(ownerId: string): Promise<IDomain[]> {
    const members = await this.prismaService.projectModel.findMany({
      where: {
        type: ProjectTypeModel.ROOT,
        DomainMemberModel: {
          some: {
            userId: ownerId,
            role: ProjectRoleModel.OWNER,
          },
        },
      },
    });

    const domain = await Promise.all(
      members.map(async (member) => {
        const d = await this.prismaService.domainModel.findFirst({
          where: {
            rootProjectId: member.id,
          },
          include: {
            rootProject: true,
          },
        });
        return d;
      }),
    );

    console.log(domain);
    const result = domain.map((d) => this.mapToDomain(d));
    return result;
  }

  mapToDomain(persistencyObject: any): IDomain {
    console.log(persistencyObject);
    const domain: IDomain = {
      vpc: {
        cidr: persistencyObject.vpc.cidr,
        cloudstackId: persistencyObject.vpc.cloudstackId,
        dns1: persistencyObject.vpc.dns1,
        dns2: persistencyObject.vpc.dns2,
        name: persistencyObject.vpc.name,
        state: persistencyObject.vpc.state,
      },
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
