import { RoleModel } from '@prisma/client';
import { IProjectUser } from 'src/domain/entities/project-user';

export class AddProjectUserOutputDto {
  userId: string;
  projectId: string;
  role: RoleModel;

  constructor(projectUser: IProjectUser) {
    this.userId = projectUser.user.id;
    this.projectId = projectUser.project.id;
    this.role = projectUser.role;
  }
}
