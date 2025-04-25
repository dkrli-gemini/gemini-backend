import { DomainMemberModel, ProjectModel } from '@prisma/client';

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
  role: string;

  constructor(domainMember: any) {
    this.id = domainMember.id;
    this.userId = domainMember.userId;
    this.project = new ProjectDto(domainMember.project);
    this.role = domainMember.role;
  }
}

export class GetUserProjectsOutputDto {
  projects: DomainMemberDto[];

  constructor(domainMembers: DomainMemberModel[]) {
    this.projects = domainMembers.map((member) => {
      return new DomainMemberDto(member);
    });
  }
}
