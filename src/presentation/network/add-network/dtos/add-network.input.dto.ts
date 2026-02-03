import { ApiProperty } from '@nestjs/swagger';

export class AddNetworkInputDto {
  @ApiProperty({ type: String, required: true })
  name: string;
  @ApiProperty({ type: String, required: true })
  gateway: string;
  @ApiProperty({ type: String, required: true })
  netmask: string;
  @ApiProperty({ type: String, required: true })
  cloudstackAclId: string;
  @ApiProperty({ type: String, required: true })
  cloudstackOfferId: string;
  @ApiProperty({ type: String, required: false })
  zoneId?: string;
}
