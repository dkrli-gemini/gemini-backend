import { IProject } from 'src/domain/entities/project';
import { IProjectUser } from 'src/domain/entities/project-user';
import { IUser } from 'src/domain/entities/user';
import { IUseCase } from '../../use-case';

export interface IGetProjectUsersInput {
  projectId: string;
}

export type IGetProjectUsersOutput = IProjectUser[];

export abstract class IGetProjectUsers
  implements IUseCase<IGetProjectUsersInput, IGetProjectUsersOutput>
{
  abstract execute(
    input: IGetProjectUsersInput,
  ): Promise<IGetProjectUsersOutput>;
}
