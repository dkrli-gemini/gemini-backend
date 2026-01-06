import { ResourceType } from '@prisma/client';

export class BillingEntryDto {
  id: string;
  domainId: string;
  projectId?: string;
  resourceId: string;
  resourceType: ResourceType;
  description: string;
  quantity: number;
  unitPriceInCents: number;
  totalInCents: number;
  createdAt: Date;
  virtualMachineId?: string;
  metadata?: Record<string, unknown>;

  constructor(entry: any) {
    this.id = entry.id;
    this.domainId = entry.domainId;
    this.projectId = entry.projectId ?? undefined;
    this.resourceId = entry.resourceId;
    this.resourceType = entry.resourceType;
    this.description = entry.description;
    this.quantity = entry.quantity;
    this.unitPriceInCents = entry.unitPriceInCents ?? 0;
    this.totalInCents = entry.totalInCents ?? 0;
    this.createdAt = entry.createdAt;
    this.virtualMachineId = entry.virtualMachineId ?? undefined;
    this.metadata = entry.metadata ?? undefined;
  }
}

export interface MachineSpecs {
  cpuNumber?: number;
  cpuSpeedMhz?: number;
  memoryInMb?: number;
  rootDiskSizeInGb?: number;
}

export interface MachineBillingSummaryInput {
  machineId: string;
  machineName: string;
  totalInCents: number;
  createdAt: Date;
  entries: BillingEntryDto[];
  specs?: MachineSpecs;
  offerName?: string;
}

export class MachineBillingEntryDto {
  machineId: string;
  machineName: string;
  totalInCents: number;
  resources: BillingEntryDto[];
  createdAt: Date;
  specs?: MachineSpecs;
  offerName?: string;

  constructor(machine: MachineBillingSummaryInput) {
    this.machineId = machine.machineId;
    this.machineName = machine.machineName;
    this.totalInCents = machine.totalInCents;
    this.resources = machine.entries;
    this.createdAt = machine.createdAt;
    this.specs = machine.specs;
    this.offerName = machine.offerName;
  }
}

export class ListBillingEntriesOutputDto {
  machines: MachineBillingEntryDto[];
  otherEntries: BillingEntryDto[];
  totalInCents: number;

  constructor(input: {
    machines: MachineBillingSummaryInput[];
    otherEntries: BillingEntryDto[];
  }) {
    this.machines = input.machines.map(
      (machine) => new MachineBillingEntryDto(machine),
    );
    this.otherEntries = input.otherEntries;
    const machineTotals = this.machines.reduce(
      (acc, machine) => acc + (machine.totalInCents ?? 0),
      0,
    );
    const otherTotals = this.otherEntries.reduce(
      (acc, entry) => acc + (entry.totalInCents ?? 0),
      0,
    );
    this.totalInCents = machineTotals + otherTotals;
  }
}
