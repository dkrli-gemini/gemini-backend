import { IEntityBase } from '../models/entity-base';

export enum AclActionEnum {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

export enum AclTraficTypeEnum {
  INGRESS = 'INGRESS',
  EGRESS = 'EGRESS',
}

export enum NetworkProtocolEnum {
  TCP = 'TCP',
  UDP = 'UDP',
}

export interface IAclList extends IEntityBase {
  name: string;
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
  description?: string;
}
