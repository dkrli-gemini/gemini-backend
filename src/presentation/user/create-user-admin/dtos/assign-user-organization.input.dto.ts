import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignUserOrganizationInputDto {
  @ApiProperty({ type: 'string' })
  userId: string;

  @ApiProperty({ type: 'string' })
  domainId: string;

  @ApiPropertyOptional({ type: 'boolean', default: true })
  replaceExisting?: boolean;
}
