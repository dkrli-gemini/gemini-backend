import { IUseCase } from '../../use-case';

export interface IGetProjectUsersInput {
  projectId: string;
}

export interface IGetProjectUsersOutput {}

export abstract class IGetProjectUsers
  implements IUseCase<IGetProjectUsersInput, IGetProjectUsersOutput>
{
  abstract execute(
    input: IGetProjectUsersInput,
  ): Promise<IGetProjectUsersOutput>;
}
