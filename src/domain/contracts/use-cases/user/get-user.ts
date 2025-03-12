import { IUser } from 'src/domain/entities/user';
import { IUseCase } from '../../use-case';

export interface IGetUserInput {
  userId: string;
}

export type IGetUserOutput = IUser;

export abstract class IGetUser
  implements IUseCase<IGetUserInput, IGetUserOutput>
{
  abstract execute(input: IGetUserInput): Promise<IUser>;
}
