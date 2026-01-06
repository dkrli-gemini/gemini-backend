import { Injectable, Provider } from '@nestjs/common';
import {
  IDomain,
  IDomainType,
  OrganizationBillingType,
} from 'src/domain/entities/domain';
import { IDomainRepository } from 'src/domain/repository/domain.repoitory';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class DomainRepositoryAdapter implements IDomainRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createRootDomain(domain: Partial<IDomain>) {
    const result = await this.prismaService.domainModel.create({
      data: {
        cloudstackAccountId: domain.cloudstackAccountId,
        type: IDomainType.ROOT,
        name: domain.name,
        billingType: domain.billingType ?? OrganizationBillingType.POOL,
      },
      include: {},
    });

    return this.mapToDomain(result);
  }

  async getDomainByVpc(vpcId: string): Promise<IDomain> {
    const domain = await this.prismaService.domainModel.findFirst({
      where: {
        vpcId,
      },
    });

    return this.mapToDomain(domain);
  }

  async createDomain(domain: IDomain): Promise<IDomain> {
    const result = await this.prismaService.domainModel.create({
      data: {
        id: domain.id,
        cloudstackAccountId: domain.cloudstackAccountId,
        type: domain.type,
        billingType: domain.billingType ?? OrganizationBillingType.POOL,
        root: domain.root
          ? {
              connect: {
                id: domain.root.id,
              },
            }
          : undefined,
        vpc: {
          create: {
            id: domain.vpc.id,
            cidr: domain.vpc.cidr,
            dns1: domain.vpc.dns1,
            dns2: domain.vpc.dns2,
            name: domain.vpc.name,
            state: domain.vpc.state,
          },
        },
        name: domain.name,
      },
      include: {
        vpc: true,
      },
    });

    return this.mapToDomain(result);
  }

  async getDomain(id: string): Promise<IDomain> {
    const result = await this.prismaService.domainModel.findUnique({
      where: {
        id,
      },
      include: {
        vpc: true,
      },
    });

    return this.mapToDomain(result);
  }

  mapToDomain(persistencyObject: any): IDomain {
    const domain: IDomain = {
      vpc: persistencyObject.vpc
        ? {
            cidr: persistencyObject.vpc.cidr,
            dns1: persistencyObject.vpc.dns1,
            dns2: persistencyObject.vpc.dns2,
            name: persistencyObject.vpc.name,
            state: persistencyObject.vpc.state,
          }
        : null,
      id: persistencyObject.id ?? null,
      root: persistencyObject.rootId ?? null,
      type: persistencyObject.type,
      cloudstackAccountId: persistencyObject.cloudstackAccountId,
      name: persistencyObject.name,
      billingType: persistencyObject.billingType as OrganizationBillingType,
    };

    return domain;
  }
}

export const DomainRepositoryProvider: Provider = {
  provide: IDomainRepository,
  useClass: DomainRepositoryAdapter,
};
