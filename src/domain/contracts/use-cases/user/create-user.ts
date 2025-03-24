import { IUser } from 'src/domain/entities/user';
import { IUseCase } from '../../use-case';

export interface ICreateUserInput {}

export type ICreateUserOutput = IUser;

export abstract class ICreateUser
  implements IUseCase<ICreateUserInput, ICreateUserOutput>
{
  abstract execute(input: ICreateUserInput): Promise<IUser>;
}
