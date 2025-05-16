import { ProjectModel, ProjectRoleModel } from '@prisma/client';

export class ProjectDto {
  id: string;
  name: string;

  constructor(project: ProjectModel) {
    this.id = project.id;
    this.name = project.name;
  }
}

export class DomainMemberDto {
  id: string;
  userId: string;
  project: ProjectDto;
  domainName: string;
  domainId: string;
  role: string;

  constructor(domainMember: IGetUserProjectsDtoOutput) {
    this.id = domainMember.id;
    this.userId = domainMember.userId;
    this.project = new ProjectDto(domainMember.project);
    this.role = domainMember.role;
    this.domainId = domainMember.domainId;
    this.domainName = domainMember.domainName;
  }
}

export interface IGetUserProjectsDtoOutput {
  id: string;
  userId: string | null;
  role: ProjectRoleModel;
  project: ProjectModel;
  domainId: string;
  domainName: string;
}

export class GetUserProjectsOutputDto {
  projectMembers: DomainMemberDto[];

  constructor(domainMembers: IGetUserProjectsDtoOutput[]) {
    this.projectMembers = domainMembers.map((member) => {
      return new DomainMemberDto(member);
    });
  }
}
