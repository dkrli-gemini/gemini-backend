import { ApiProperty } from '@nestjs/swagger';

export class ApplicationError extends Error {
  @ApiProperty()
  name: string;
  @ApiProperty({ type: String })
  message: any;
}
