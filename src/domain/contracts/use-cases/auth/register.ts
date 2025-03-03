import { IUseCase } from '../../use-case';

export type IRegisterInput = null;
export interface IRegisterOutput {
  token: string;
}

export abstract class IRegister
  implements IUseCase<IRegisterInput, IRegisterOutput>
{
  abstract execute(input: null): Promise<IRegisterOutput>;
}
