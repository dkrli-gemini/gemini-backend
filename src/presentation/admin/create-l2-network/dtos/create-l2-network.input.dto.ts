import { ApiProperty } from '@nestjs/swagger';

export class CreateL2NetworkInputDto {
  @ApiProperty({ type: String, required: true })
  projectId: string;

  @ApiProperty({ type: String, required: true })
  networkId: string;
}
