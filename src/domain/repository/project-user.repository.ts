import { ProjectUserModel } from '@prisma/client';
import { IRepositoryBase } from '../contracts/repository-base';
import { IProjectUser } from '../entities/project-user';

export abstract class IProjectUserRepository
  implements IRepositoryBase<IProjectUser>
{
  abstract createProjectUser(projectUser: IProjectUser): Promise<IProjectUser>;
  abstract mapToDomain(persistencyObject: any): IProjectUser;
}
