import { Provider } from '@nestjs/common';
import { IProject } from 'src/domain/entities/project';
import { IVirtualMachine } from 'src/domain/entities/virtual-machine';
import { IVirtualMachineRepository } from 'src/domain/repository/virtual-machine.repository';
import { PrismaService } from '../../prisma.service';

export class VirtualMachineRepositoryAdapter
  implements IVirtualMachineRepository
{
  constructor(private readonly prisma: PrismaService) {}

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
      },
    });

    return this.mapToDomain(virtualMachineCreated);
  }
  mapToDomain(persistencyObject: any): IVirtualMachine {
    const machine: IVirtualMachine = {
      cloudstackOfferId: persistencyObject.cloudstackOfferId,
      cloudstackTemplateId: persistencyObject.cloustackTemplateId,
      name: persistencyObject.name,
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
