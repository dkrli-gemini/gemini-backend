import { IUseCase } from '../../use-case';

export interface ILoginInput {
  username: string;
  password: string;
}

export type ILoginOutput = any;

export abstract class ILogin implements IUseCase<ILoginInput, ILoginOutput> {
  abstract execute(input: ILoginInput): Promise<ILoginOutput>;
}
