import { IUser } from 'src/domain/entities/user';
import { IUseCase } from '../../use-case';

export interface ICreateUserInput {
  id: string;
  name: string;
  email: string;
}

export type ICreateUserOutput = IUser;

export abstract class ICreateUser
  implements IUseCase<ICreateUserInput, ICreateUserOutput>
{
  abstract execute(input: ICreateUserInput): Promise<IUser>;
}
