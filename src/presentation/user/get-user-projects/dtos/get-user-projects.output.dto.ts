import { DomainMemberModel } from '@prisma/client';

export class DomainMemberDto {
  id: string;
  userId: string;
  projectId: string;
  role: string;

  constructor(domainMember: DomainMemberModel) {
    this.id = domainMember.id;
    this.userId = domainMember.userId;
    this.projectId = domainMember.projectModelId;
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
