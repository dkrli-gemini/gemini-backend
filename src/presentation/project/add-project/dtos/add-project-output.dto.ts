import { IProject } from 'src/domain/entities/project';

export class AddProjectOutputDto {
  id: string;
  name: string;

  constructor(project: IProject) {
    this.id = project.id;
    this.name = project.name;
  }
}
