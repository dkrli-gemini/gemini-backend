import { IVirtualMachine } from 'src/domain/entities/virtual-machine';

export class VirtualMachineDto {
  id: string;
  name: string;
  os: string;
  state: string;
  ipAddress: string;

  constructor(machine: IVirtualMachine) {
    this.id = machine.id;
    this.os = machine.os;
    this.state = machine.state;
    this.ipAddress = machine.ipAddress;
  }
}

export class ListVirtualMachinesOutputDto {
  machines: VirtualMachineDto[];

  constructor(input: IVirtualMachine[]) {
    this.machines = input.map((machine) => new VirtualMachineDto(machine));
  }
}
