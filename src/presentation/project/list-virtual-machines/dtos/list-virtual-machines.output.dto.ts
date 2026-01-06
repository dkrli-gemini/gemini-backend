import { IInstance } from 'src/domain/entities/instance';
import { ITemplate } from 'src/domain/entities/template';
import { IVirtualMachine } from 'src/domain/entities/virtual-machine';

export class InstanceDto {
  id: string;
  name: string;
  memory: string;
  cloudstackId: string;
  disk: string;
  cpu: string;
  networkName: string;
  cpuNumber?: number;
  cpuSpeedMhz?: number;
  memoryInMb?: number;
  rootDiskSizeInGb?: number;

  constructor(instance: IInstance) {
    this.id = instance.id;
    this.name = instance.name;
    this.cpu = instance.cpu;
    this.memory = instance.memory;
    this.disk = instance.disk;
    this.cpuNumber = instance.cpuNumber;
    this.cpuSpeedMhz = instance.cpuSpeedMhz;
    this.memoryInMb = instance.memoryInMb;
    this.rootDiskSizeInGb = instance.rootDiskSizeInGb;
  }
}

export class TemplateDto {
  id: string;
  name: string;
  cloudstackId: string;
  url?: string;

  constructor(template: ITemplate) {
    this.id = template.id;
    this.name = template.name;
    this.cloudstackId = template.cloudstackId;
    this.url = template.url;
  }
}

export class VirtualMachineDto {
  id: string;
  name: string;
  state: string;
  ipAddress: string;
  instance: InstanceDto;
  template: TemplateDto;
  networkName: string;
  cpuNumber?: number;
  cpuSpeedMhz?: number;
  memoryInMb?: number;
  rootDiskSizeInGb?: number;

  constructor(machine: IVirtualMachine) {
    this.id = machine.id;
    this.name = machine.name;
    this.state = machine.state;
    this.ipAddress = machine.ipAddress;
    this.instance = new InstanceDto(machine.instance);
    this.template = new TemplateDto(machine.template);
    this.networkName = machine.network?.name;
    this.cpuNumber = machine.cpuNumber ?? Number(machine.instance.cpu);
    this.cpuSpeedMhz = machine.cpuSpeedMhz;
    this.memoryInMb = machine.memoryInMb ?? Number(machine.instance.memory);
    this.rootDiskSizeInGb = machine.rootDiskSizeInGb ?? Number(machine.instance.disk);
  }
}

export class ListVirtualMachinesOutputDto {
  machines: VirtualMachineDto[];

  constructor(input: IVirtualMachine[]) {
    this.machines = input.map((machine) => new VirtualMachineDto(machine));
  }
}
