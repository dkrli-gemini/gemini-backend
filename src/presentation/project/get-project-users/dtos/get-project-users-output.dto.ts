import { IProjectUser } from 'src/domain/entities/project-user';
import { IUser } from 'src/domain/entities/user';
import { ProjectRole } from 'src/domain/types/project-role';

export class UserDto {
  id: string;
  name: string;
  email: string;

  constructor(user: IUser) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}

export class ProjectUserDto { 
  id: string;
  user: UserDto;
  projectId: string;
  role: ProjectRole;

  constructor(user: IProjectUser) {
    this.id = user.id;
    this.user = new UserDto(user.user);
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
