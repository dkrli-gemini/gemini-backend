import { IProjectUser } from 'src/domain/entities/project-user';
import { ProjectRole } from 'src/domain/types/project-role';

export class ProjectUserDto {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectRole;

  constructor(user: IProjectUser) {
    this.id = user.id;
    this.userId = user.user.id;
    this.projectId = user.project.id;
    this.role = user.role;
  }
}

export class GetProjectUsersOutputDto {
  users: ProjectUserDto[];

  constructor(usersInput: IProjectUser[]) {
    this.users = [];

    usersInput.forEach((user) => {
      this.users.push(new ProjectUserDto(user));
    });
  }
}
