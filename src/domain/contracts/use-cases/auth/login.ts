import { IUseCase } from '../../use-case';

export interface ILoginInput {}

export interface ILoginOutput {}

export abstract class ILogin implements IUseCase<ILoginInput, ILoginOutput> {
  abstract execute(input: ILoginInput): Promise<ILoginOutput>;
}
