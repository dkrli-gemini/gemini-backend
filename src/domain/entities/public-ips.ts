import { IEntityBase } from '../models/entity-base';
import { NetworkProtocolEnum } from './acl-list';

export interface IPublicIp extends IEntityBase {
  address: string;
}

export interface IPortForwardRule extends IEntityBase {
  privatePortStart: string;
  privatePortEnd: string;
  publicPortStart: string;
  publicPortEnd: string;
  protocol: NetworkProtocolEnum;
  sourceCidrs: string[];
  virtualMachineId: string;
  publicIpId: string;
}
