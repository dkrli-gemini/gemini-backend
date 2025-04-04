import { ApiProperty } from '@nestjs/swagger';

export class AddVirtualMachineInputDto {
  @ApiProperty({ type: String, required: true })
  name: string;
  @ApiProperty({ type: String, required: true })
  cloudstackOfferId: string;
  @ApiProperty({ type: String, required: true })
  cloudstackTemplateId: string;
  @ApiProperty({ type: String, required: true })
  networkId: string;
}
