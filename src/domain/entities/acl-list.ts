import { IEntityBase } from '../models/entity-base';

export enum AclActionEnum {
  ALLOW = 'allow',
  DENY = 'deny',
}

export enum AclTraficTypeEnum {
  INGRESS = 'ingress',
  EGRESS = 'egress',
}

export enum NetworkProtocolEnum {
  TCP = 'TCP',
  UDP = 'UDP',
}

export interface IAclList extends IEntityBase {
  name: string;
  vpcId: string;
  description?: string;
}

export interface IAclRule extends IEntityBase {
  aclId: string;
  cidrList: string[];
  action: AclActionEnum;
  startPort: string;
  endPort: string;
  trafficType: AclTraficTypeEnum;
  protocol: NetworkProtocolEnum;
}
