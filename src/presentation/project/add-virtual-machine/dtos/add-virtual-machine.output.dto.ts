import { ApiProperty } from '@nestjs/swagger';
import { IVirtualMachine } from 'src/domain/entities/virtual-machine';

export class AddVirtualMachineOutputDto {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: String })
  cloudstackOfferId: string;
  @ApiProperty({ type: String })
  os: string;
  @ApiProperty({ type: String })
  projectId: string;
  @ApiProperty({ type: String })
  state: string;
  @ApiProperty({ type: String })
  ipAddress: string;

  constructor(machine: IVirtualMachine) {
    this.id = machine.id;
    this.name = machine.name;
    this.cloudstackOfferId = machine.cloudstackOfferId;
    this.os = machine.os;
    this.projectId = machine.project.id;
    this.state = machine.state;
    this.ipAddress = machine.ipAddress;
  }
}
