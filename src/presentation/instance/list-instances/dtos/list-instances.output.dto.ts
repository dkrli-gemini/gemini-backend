import { IInstance } from 'src/domain/entities/instance';

export class InstanceOfferDto {
  id: string;
  name: string;
  sku?: string;
  family?: string;
  profile?: string;
  cpuNumber: number;
  cpuSpeedMhz: number;
  memoryInMb: number;
  rootDiskSizeInGb: number;
  diskTier?: string;

  constructor(instance: IInstance) {
    this.id = instance.id;
    this.name = instance.name;
    this.sku = instance.sku;
    this.family = instance.family;
    this.profile = instance.profile;
    this.cpuNumber = instance.cpuNumber;
    this.cpuSpeedMhz = instance.cpuSpeedMhz;
    this.memoryInMb = instance.memoryInMb;
    this.rootDiskSizeInGb = instance.rootDiskSizeInGb;
    this.diskTier = instance.diskTier;
  }
}

export class ListInstancesOutputDto {
  offers: InstanceOfferDto[];

  constructor(instances: IInstance[]) {
    this.offers = instances.map((instance) => new InstanceOfferDto(instance));
  }
}
