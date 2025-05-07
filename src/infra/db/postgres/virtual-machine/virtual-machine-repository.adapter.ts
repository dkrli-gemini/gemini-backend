import { Injectable, Provider } from '@nestjs/common';
import { IProject } from 'src/domain/entities/project';
import { IVirtualMachine } from 'src/domain/entities/virtual-machine';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';
import { PrismaService } from '../../prisma.service';

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
        cloudstackOfferId: input.cloudstackOfferId,
        cloudstackTemplateId: input.cloudstackTemplateId,
        name: input.name,
        ipAddress: input.ipAddress,
        os: input.os,
        projectId: input.project.id,
        state: input.state,
        cloudstackId: input.cloudstackId,
      },
      include: {
        project: true,
      },
    });

    return this.mapToDomain(virtualMachineCreated);
  }

  async listVirtualMachines(projectId: string): Promise<IVirtualMachine[]> {
    const machines = await this.prisma.virtualMachineModel.findMany({
      where: {
        projectId: projectId,
      },
      include: { project: true },
    });

    const response = machines.map((machine) => {
      return this.mapToDomain(machine);
    });
    return response;
  }

  mapToDomain(persistencyObject: any): IVirtualMachine {
    const machine: IVirtualMachine = {
      id: persistencyObject.id,
      cloudstackOfferId: persistencyObject.cloudstackOfferId,
      cloudstackTemplateId: persistencyObject.cloustackTemplateId,
      name: persistencyObject.name,
      cloudstackId: persistencyObject.cloudstackId,
      ipAddress: persistencyObject.ipAddress,
      os: persistencyObject.os,
      project: {
        id: persistencyObject.project.id,
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
