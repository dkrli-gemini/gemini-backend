import { Injectable, Provider } from '@nestjs/common';
import {
  IGetProjectUsers,
  IGetProjectUsersInput,
  IGetProjectUsersOutput,
} from 'src/domain/contracts/use-cases/project/get-project-users';
import { IProjectUserRepository } from 'src/domain/repository/project-user.repository';

@Injectable()
export class GetProjectUsers implements IGetProjectUsers {
  constructor(private readonly projectUserRepository: IProjectUserRepository) {}

  async execute(input: IGetProjectUsersInput): Promise<IGetProjectUsersOutput> {
    const projectUsers = await this.projectUserRepository.getProjectUsers(
      input.projectId,
    );

    

    return projectUsers;
  }
}

export const GetProjectUserProvider: Provider = {
  provide: IGetProjectUsers,
  useClass: GetProjectUsers,
};
