import { ApiProperty } from '@nestjs/swagger';

export class AddVolumeInputDto {
  @ApiProperty({ type: String, required: true })
  name: string;
  @ApiProperty({ type: String, required: true })
  offerId: string;
  @ApiProperty({ type: Number, required: true })
  sizeInGb: number;
}
