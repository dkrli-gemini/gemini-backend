import { IEntityBase } from '../models/entity-base';

export enum IValuableTagEnum {
  VirtualMachineOffer = 'VirtualMachineOffer',
  VirtualMachineVolume = 'VirtualMachineVolume',
  PublicIP = 'PublicIP',
}

export enum IChargeTypeEnum {
  MONTHLY = 'MONTHLY',
  HOURLY = 'HOURLY',
  ONE_TIME = 'ONE_TIME',
}

export interface IValuableObject extends IEntityBase {
  tag: IValuableTagEnum;
  chargeType: IChargeTypeEnum;
  costInCents: number;
  alternativeCostInCents?: number;
  entityId?: string;
}
