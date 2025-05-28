import { IUseCase } from '../../use-case';

export interface IAddVirtualMachineInput {
  name: string;
  instanceId: string;
  templateId: string;
  projectId: string;
  networkId: string;
}

export type IAddVirtualMachineOutput = {
  id: string;
  cloudstackId: string;
  jobId: string;
};

export abstract class IAddVirtualMachine
  implements IUseCase<IAddVirtualMachineInput, IAddVirtualMachineOutput>
{
  abstract execute(
    input: IAddVirtualMachineInput,
  ): Promise<IAddVirtualMachineOutput>;
}
