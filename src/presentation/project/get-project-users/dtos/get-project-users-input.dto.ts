import { ApiProperty } from '@nestjs/swagger';

export class GetProjectUsersInputDto {
  @ApiProperty({ type: 'string' })
  projectId: string;
}
