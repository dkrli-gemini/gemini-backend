import { Injectable, Provider } from '@nestjs/common';
import { IProject } from 'src/domain/entities/project';
import { IVirtualMachine } from 'src/domain/entities/virtual-machine';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';
import { PrismaService } from '../../prisma.service';
import { IInstance } from 'src/domain/entities/instance';
import { ITemplate } from 'src/domain/entities/template';

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
      include: { project: true, instance: true, template: true },
    });
    return this.mapToDomain(machine);
  }

  async createVirtualMachine(
    input: Partial<IVirtualMachine>,
  ): Promise<IVirtualMachine> {
    const virtualMachineCreated = await this.prisma.virtualMachineModel.create({
      data: {
        id: input.id,
        instance: {
          connect: {
            id: input.instance.id,
          },
        },
        template: {
          connect: {
            id: input.template.id,
          },
        },
        name: input.name,
        ipAddress: input.ipAddress,
        project: {
          connect: {
            id: input.project.id,
          },
        },
        state: input.state,
      },
      include: { instance: true },
    });

    return this.mapToDomain(virtualMachineCreated);
  }

  async listVirtualMachines(projectId: string): Promise<IVirtualMachine[]> {
    const machines = await this.prisma.virtualMachineModel.findMany({
      where: {
        projectId: projectId,
      },
      include: { project: true, instance: true, template: true },
    });

    const response = machines.map((machine) => {
      return this.mapToDomain(machine);
    });
    return response;
  }

  mapToDomain(persistencyObject: any): IVirtualMachine {
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
      name: persistencyObject.name,
      ipAddress: persistencyObject.ipAddress,
      template: {
        id: persistencyObject.templateId,
      } as ITemplate,
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
