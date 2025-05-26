import { IInstance } from 'src/domain/entities/instance';
import { IVirtualMachine } from 'src/domain/entities/virtual-machine';

export class InstanceDto {
  id: string;
  name: string;
  memory: string;
  cloudstackId: string;
  disk: string;
  cpu: string;

  constructor(instance: IInstance) {
    this.id = instance.id;
    this.name = instance.name;
    this.cloudstackId = instance.cloudstackId;
    this.cpu = instance.cpu;
    this.memory = instance.memory;
    this.disk = instance.disk;
  }
}

export class VirtualMachineDto {
  id: string;
  name: string;
  os: string;
  state: string;
  ipAddress: string;
  cloudstackId: string;
  instance: InstanceDto;

  constructor(machine: IVirtualMachine) {
    this.id = machine.id;
    this.os = machine.os;
    this.name = machine.name;
    this.state = machine.state;
    this.ipAddress = machine.ipAddress;
    this.cloudstackId = machine.cloudstackId;
    this.instance = new InstanceDto(machine.instance);
  }
}

export class ListVirtualMachinesOutputDto {
  machines: VirtualMachineDto[];

  constructor(input: IVirtualMachine[]) {
    this.machines = input.map((machine) => new VirtualMachineDto(machine));
  }
}
