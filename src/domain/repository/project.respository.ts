import { IRepositoryBase } from '../contracts/repository-base';
import { IProject } from '../entities/project';

export abstract class IProjectRepository implements IRepositoryBase<IProject> {
  abstract createProject(project: IProject, userId: string): Promise<IProject>;
  abstract mapToDomain(persistencyObject: any): IProject;
}
