import {
  AclActionModel,
  AclListModel,
  AclRuleModel,
  AclTrafficType,
  NetworkProtocolModel,
} from '@prisma/client';

export class AclRuleDto {
  id: string;
  cidr: string;
  startPort: string;
  endPort: string;
  action: AclActionModel;
  trafficType: AclTrafficType;
  protocol: NetworkProtocolModel;

  constructor(rule: AclRuleModel) {
    this.id = rule.id;
    this.cidr = rule.cidrList[0];
    this.startPort = rule.startPort;
    this.endPort = rule.endPort;
    this.action = rule.action;
    this.trafficType = rule.trafficType;
    this.protocol = rule.protocol;
  }
}

export class AclListDto {
  id: string;
  name: string;
  description: string;
  rules: AclRuleDto[];

  constructor(list: any) {
    this.id = list.id;
    this.name = list.name;
    this.description = list.description;
    this.rules = list.AclRule.map((r) => new AclRuleDto(r));
  }
}

export class ListAclOutputDto {
  lists: AclListDto[];

  constructor(input: AclListModel[]) {
    this.lists = input.map((l) => new AclListDto(l));
  }
}
