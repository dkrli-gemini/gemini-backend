import { Provider } from '@nestjs/common';
import {
  IAddProjectUser,
  IAddProjectUserInput,
} from 'src/domain/contracts/use-cases/project/add-project-user';
import { IProject } from 'src/domain/entities/project';
import { IProjectUser } from 'src/domain/entities/project-user';
import { IUser } from 'src/domain/entities/user';
import { IProjectUserRepository } from 'src/domain/repository/project-user.repository';

export class AddProjectUser implements IAddProjectUser {
  constructor(private readonly projectUserRepository: IProjectUserRepository) {}

  async execute(input: IAddProjectUserInput): Promise<IProjectUser> {
    const { userId, projectId, role } = input;

    const projectUser = await this.projectUserRepository.createProjectUser({
      project: { id: projectId } as IProject,
      role: role,
      user: { id: userId } as IUser,
    });

    return projectUser;
  }
}

export const AddProjectUserProvider: Provider = {
  provide: IAddProjectUser,
  useClass: AddProjectUser,
};
