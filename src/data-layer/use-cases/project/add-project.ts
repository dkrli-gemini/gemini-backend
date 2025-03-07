import { Injectable, Provider } from '@nestjs/common';
import {
  IAddProject,
  IAddProjectInput,
} from 'src/domain/contracts/use-cases/project/add-project';
import { IProject } from 'src/domain/entities/project';
import { IProjectRepository } from 'src/domain/repository/project.respository';
import { IUserRepository } from 'src/domain/repository/user.repository';

@Injectable()
export class AddProject implements IAddProject {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(input: IAddProjectInput): Promise<IProject> {
    const project = await this.projectRepository.createProject(
      {
        name: input.name,
      },
      input.user.id,
    );

    return project;
  }
}

export const AddProjectProvider: Provider = {
  provide: IAddProject,
  useClass: AddProject,
};
