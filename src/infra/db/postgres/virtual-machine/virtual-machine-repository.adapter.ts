import { Injectable, Provider } from '@nestjs/common';
import { IProject } from 'src/domain/entities/project';
import { IVirtualMachine } from 'src/domain/entities/virtual-machine';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';
import { PrismaService } from '../../prisma.service';
import { IInstance } from 'src/domain/entities/instance';

@Injectable()
export class VirtualMachineRepositoryAdapter
  implements IVirtualMachineRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async getMachine(id: string): Promise<IVirtualMachine> {
    const machine = await this.prisma.virtualMachineModel.findUnique({
      where: {
        id: id,
      },
      include: { project: true },
    });
    return this.mapToDomain(machine);
  }

  async createVirtualMachine(
    input: Partial<IVirtualMachine>,
  ): Promise<IVirtualMachine> {
    const virtualMachineCreated = await this.prisma.virtualMachineModel.create({
      data: {
        instance: {
          connect: {
            id: input.instance.id,
          },
        },
        cloudstackTemplateId: input.cloudstackTemplateId,
        name: input.name,
        ipAddress: input.ipAddress,
        os: input.os,
        project: {
          connect: {
            id: input.project.id,
          },
        },
        state: input.state,
        cloudstackId: input.cloudstackId,
      },
    });

    return this.mapToDomain(virtualMachineCreated);
  }

  async listVirtualMachines(projectId: string): Promise<IVirtualMachine[]> {
    const machines = await this.prisma.virtualMachineModel.findMany({
      where: {
        projectId: projectId,
      },
      include: { project: true, instance: true },
    });

    const response = machines.map((machine) => {
      return this.mapToDomain(machine);
    });
    return response;
  }

  mapToDomain(persistencyObject: any): IVirtualMachine {
    console.log(persistencyObject);

    const machine: IVirtualMachine = {
      id: persistencyObject.id,
      instance: {
        id: persistencyObject.instanceId,
        cloudstackId: persistencyObject.instance.cloudstackId,
        cpu: persistencyObject.instance.cpu,
        disk: persistencyObject.instance.disk,
        memory: persistencyObject.instance.memory,
        name: persistencyObject.instance.name,
      } as IInstance,
      cloudstackTemplateId: persistencyObject.cloustackTemplateId,
      name: persistencyObject.name,
      cloudstackId: persistencyObject.cloudstackId,
      ipAddress: persistencyObject.ipAddress,
      os: persistencyObject.os,
      project: {
        id: persistencyObject.projectId,
      } as IProject,
      state: persistencyObject.state,
    };
    return machine;
  }
}

export const VirtualMachineRepositoryProvider: Provider = {
  provide: IVirtualMachineRepository,
  useClass: VirtualMachineRepositoryAdapter,
};
