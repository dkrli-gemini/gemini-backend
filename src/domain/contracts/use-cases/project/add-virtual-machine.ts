import { IVirtualMachine } from 'src/domain/entities/virtual-machine';
import { IUseCase } from '../../use-case';

export interface IAddVirtualMachineInput {
  name: string;
  instanceId: string;
  cloudstackTemplateId: string;
  projectId: string;
  networkId: string;
}

export type IAddVirtualMachineOutput = IVirtualMachine;

export abstract class IAddVirtualMachine
  implements IUseCase<IAddVirtualMachineInput, IAddVirtualMachineOutput>
{
  abstract execute(input: IAddVirtualMachineInput): Promise<IVirtualMachine>;
}
