import { ApiProperty } from '@nestjs/swagger';
import { IAddVirtualMachineOutput } from 'src/domain/contracts/use-cases/project/add-virtual-machine';

export class AddVirtualMachineOutputDto {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  cloudstackId: string;
  @ApiProperty({ type: String })
  jobId: string;

  constructor(machine: IAddVirtualMachineOutput) {
    this.id = machine.id;
    this.cloudstackId = machine.cloudstackId;
    this.jobId = machine.jobId;
  }
}
