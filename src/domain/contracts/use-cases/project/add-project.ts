import { IProject } from 'src/domain/entities/project';
import { IUser } from 'src/domain/entities/user';
import { IUseCase } from '../../use-case';

export interface IAddProjectInput {
  name: string;
  user: Partial<IUser>;
}

export type IAddProjectOutput = IProject;

export abstract class IAddProject
  implements IUseCase<IAddProjectInput, IAddProjectOutput>
{
  abstract execute(input: IAddProjectInput): Promise<IProject>;
}
