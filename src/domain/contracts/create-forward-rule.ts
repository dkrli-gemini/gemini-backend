import { NetworkProtocolModel } from '@prisma/client';
import { IUseCase } from './use-case';

export interface ICreateForwardRuleInput {
  projectId: string;
  privateStart: string;
  privateEnd: string;
  publicStart: string;
  publicEnd: string;
  protocol: NetworkProtocolModel;
  machineId: string;
  publicIpId: string;
  address: string;
}

export interface ICreateForwardRuleOutput {
  id: string;
}

export abstract class ICreateForwardRule
  implements IUseCase<ICreateForwardRuleInput, ICreateForwardRuleOutput>
{
  abstract execute(
    input: ICreateForwardRuleInput,
  ): Promise<ICreateForwardRuleOutput>;
}
