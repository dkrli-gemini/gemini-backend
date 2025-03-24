import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAdminInputDto {
  @ApiProperty({ type: 'string' })
  id: string;
  @ApiProperty({ type: 'string' })
  name: string;
  @ApiProperty({ type: 'string' })
  email: string;
}
