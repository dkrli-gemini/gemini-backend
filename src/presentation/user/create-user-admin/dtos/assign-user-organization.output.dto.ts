import { ApiProperty } from '@nestjs/swagger';

export class AssignUserOrganizationOutputDto {
  @ApiProperty({ type: 'string' })
  userId: string;

  @ApiProperty({ type: 'string' })
  domainId: string;

  @ApiProperty({ type: 'string' })
  projectId: string;

  @ApiProperty({ type: 'string' })
  role: string;

  constructor(input: {
    userId: string;
    domainId: string;
    projectId: string;
    role: string;
  }) {
    this.userId = input.userId;
    this.domainId = input.domainId;
    this.projectId = input.projectId;
    this.role = input.role;
  }
}
