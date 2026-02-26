import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserInputDto {
  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  email: string;

  @ApiPropertyOptional({ type: 'string' })
  username?: string;

  @ApiProperty({ type: 'string' })
  password: string;
}
