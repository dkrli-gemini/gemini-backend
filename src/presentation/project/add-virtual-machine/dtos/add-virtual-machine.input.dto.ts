import { ApiProperty } from '@nestjs/swagger';

export class AddVirtualMachineInputDto {
  @ApiProperty({ type: String, required: true })
  name: string;
  @ApiProperty({ type: String, required: true })
  instanceId: string;
  @ApiProperty({ type: String, required: true })
  templateId: string;
  @ApiProperty({ type: String, required: true })
  networkId: string;
}
