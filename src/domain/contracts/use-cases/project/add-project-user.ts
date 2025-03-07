import { IProjectUser } from 'src/domain/entities/project-user';
import { ProjectRole } from 'src/domain/types/project-role';
import { IUseCase } from '../../use-case';

export interface IAddProjectUserInput {
  userId: string;
  projectId: string;
  role: ProjectRole;
}

export type IAddProjectUserOutput = IProjectUser;
export abstract class IAddProjectUser
  implements IUseCase<IAddProjectUserInput, IAddProjectUserOutput>
{
  abstract execute(input: IAddProjectUserInput): Promise<IAddProjectUserOutput>;
}
