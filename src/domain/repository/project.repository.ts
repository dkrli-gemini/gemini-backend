import { IRepositoryBase } from '../contracts/repository-base';
import { IProject } from '../entities/project';

export abstract class IProjectRepository implements IRepositoryBase<IProject> {
  abstract createProject(project: IProject): Promise<IProject>;
  abstract getProject(id: string): Promise<IProject>;
  abstract mapToDomain(persistencyObject: any): IProject;
}
