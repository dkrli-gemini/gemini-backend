/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IInstance } from 'src/domain/entities/instance';
import { IInstanceRepository } from 'src/domain/repository/instance.repository';
import { PrismaService } from '../../prisma.service';
import { Injectable, Provider } from '@nestjs/common';

@Injectable()
export class InstanceRepositoryAdapter implements IInstanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createInstance(instance: Partial<IInstance>): Promise<IInstance> {
    const instanceCreated = await this.prisma.instanceModel.create({
      data: {
        id: instance.id,
        cpu: instance.cpu,
        disk: instance.disk,
        memory: instance.memory,
        name: instance.name,
      },
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
    };
    return instance;
  }
}

export const InstanceRepositoryProvider: Provider = {
  provide: IInstanceRepository,
  useClass: InstanceRepositoryAdapter,
};
