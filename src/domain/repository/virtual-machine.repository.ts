import { IRepositoryBase } from '../contracts/repository-base';
import { IVirtualMachine } from '../entities/virtual-machine';

export abstract class IVirtualMachineRepository
  implements IRepositoryBase<IVirtualMachine>
{
  abstract createVirtualMachine(
    virtualMachine: Partial<IVirtualMachine>,
  ): Promise<IVirtualMachine>;
  abstract mapToDomain(persistencyObject: any): IVirtualMachine;
}
