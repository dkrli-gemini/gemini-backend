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

  constructor(instance: IInstance) {
    this.id = instance.id;
    this.name = instance.name;
    this.cloudstackId = instance.cloudstackId;
    this.cpu = instance.cpu;
    this.memory = instance.memory;
    this.disk = instance.disk;
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
  cloudstackId: string;
  instance: InstanceDto;
  template: TemplateDto;

  constructor(machine: IVirtualMachine) {
    this.id = machine.id;
    this.name = machine.name;
    this.state = machine.state;
    this.ipAddress = machine.ipAddress;
    this.cloudstackId = machine.cloudstackId;
    this.instance = new InstanceDto(machine.instance);
    this.template = new TemplateDto(machine.template);
  }
}

export class ListVirtualMachinesOutputDto {
  machines: VirtualMachineDto[];

  constructor(input: IVirtualMachine[]) {
    this.machines = input.map((machine) => new VirtualMachineDto(machine));
  }
}
