/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IInstance } from 'src/domain/entities/instance';
import { IInstanceRepository } from 'src/domain/repository/instance.repository';
import { PrismaService } from '../../prisma.service';
import { Injectable, Provider } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class InstanceRepositoryAdapter implements IInstanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createInstance(instance: Partial<IInstance>): Promise<IInstance> {
    const data: Prisma.InstanceModelCreateInput = {
      id: instance.id,
      cpu: instance.cpu,
      disk: instance.disk,
      memory: instance.memory,
      name: instance.name,
      cpuNumber: instance.cpuNumber,
      cpuSpeedMhz: instance.cpuSpeedMhz,
      memoryInMb: instance.memoryInMb,
      rootDiskSizeInGb: instance.rootDiskSizeInGb,
      sku: instance.sku,
      family: instance.family,
      profile: instance.profile,
      diskTier: instance.diskTier,
    };

    const instanceCreated = await this.prisma.instanceModel.create({
      data,
    });

    return this.mapToDomain(instanceCreated);
  }
  async getInstance(id: string): Promise<IInstance> {
    const instance = await this.prisma.instanceModel.findUnique({
      where: {
        id: id,
      },
    });

    return this.mapToDomain(instance);
  }

  async listInstances(): Promise<IInstance[]> {
    const instances = await this.prisma.instanceModel.findMany();
    const results = instances.map((inst) => this.mapToDomain(inst));
    return results;
  }
  mapToDomain(persistencyObject: any): IInstance {
    const instance: IInstance = {
      id: persistencyObject.id,
      cpu: persistencyObject.cpu,
      disk: persistencyObject.disk,
      memory: persistencyObject.memory,
      name: persistencyObject.name,
      cpuNumber: persistencyObject.cpuNumber,
      cpuSpeedMhz: persistencyObject.cpuSpeedMhz,
      memoryInMb: persistencyObject.memoryInMb,
      rootDiskSizeInGb: persistencyObject.rootDiskSizeInGb,
      sku: persistencyObject.sku,
      family: persistencyObject.family,
      profile: persistencyObject.profile,
      diskTier: persistencyObject.diskTier,
    };
    return instance;
  }
}

export const InstanceRepositoryProvider: Provider = {
  provide: IInstanceRepository,
  useClass: InstanceRepositoryAdapter,
};
