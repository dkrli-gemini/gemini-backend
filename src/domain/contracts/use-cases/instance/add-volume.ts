import { IUseCase } from '../../use-case';

export interface IAddVolumeInput {
  name: string;
  offerId: string;
  machineId: string;
  projectId: string;
  sizeInGb: number;
}

export interface IAddVolumeOutput {
  volumeId: string;
  created: boolean;
}

export abstract class IAddVolume
  implements IUseCase<IAddVolumeInput, IAddVolumeOutput>
{
  abstract execute(input: IAddVolumeInput): Promise<IAddVolumeOutput>;
}
