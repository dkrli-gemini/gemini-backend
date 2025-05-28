import {
  IResourceLimit,
  ResourceTypeEnum,
} from 'src/domain/entities/resource-limit';
import { IResourceLimitRepository } from 'src/domain/repository/resource-limit.repository';
import { PrismaService } from '../../prisma.service';
import { Injectable, Provider } from '@nestjs/common';

@Injectable()
export class ResourceLimitRepositoryAdapter
  implements IResourceLimitRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createResourceLimit(input: IResourceLimit): Promise<IResourceLimit> {
    const limitCreated = await this.prisma.resourceLimitModel.create({
      data: {
        domain: {
          connect: {
            id: input.domainId,
          },
        },
        limit: input.limit,
        used: input.used,
        type: input.type,
      },
    });

    return this.mapToDomain(limitCreated);
  }

  async createDefaultResourceLimits(
    domainId: string,
  ): Promise<IResourceLimit[]> {
    const types = [ResourceTypeEnum.NETWORK, ResourceTypeEnum.VOLUMES];
    const data: IResourceLimit[] = types.map((type) => ({
      domainId,
      type,
      limit: 0,
      used: 0,
    }));
    const resourceLimits =
      await this.prisma.resourceLimitModel.createManyAndReturn({
        data: data,
      });

    const response = resourceLimits.map((l) => this.mapToDomain(l));
    return response;
  }

  async getResourceLimit(id: string): Promise<IResourceLimit> {
    const limit = await this.prisma.resourceLimitModel.findUnique({
      where: {
        id: id,
      },
    });

    return this.mapToDomain(limit);
  }

  async listByDomain(domainId: string): Promise<IResourceLimit[]> {
    const limits = await this.prisma.resourceLimitModel.findMany({
      where: {
        domainId,
      },
    });

    const response = limits.map((l) => this.mapToDomain(l));
    return response;
  }

  mapToDomain(persistencyObject: any): IResourceLimit {
    const limit: IResourceLimit = {
      id: persistencyObject.id,
      domainId: persistencyObject.domainId,
      limit: persistencyObject.limit,
      type: persistencyObject.type,
      used: persistencyObject.used,
    };
    return limit;
  }
}

export const ResourceLimitRepositoryProvider: Provider = {
  provide: IResourceLimitRepository,
  useClass: ResourceLimitRepositoryAdapter,
};
