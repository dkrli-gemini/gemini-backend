import { NetworkProtocolModel, PortForwardRuleModel } from '@prisma/client';

class ForwardRuleDto {
  id: string;
  privateStart: string;
  privateEnd: string;
  publicStart: string;
  publicEnd: string;
  protocol: NetworkProtocolModel;
  address: string;
  publicIpId: string;
  publicIp: string;
  projectId: string;

  constructor(rule: PortForwardRuleModel) {
    this.id = rule.id;
    this.privateStart = rule.privatePortStart;
    this.publicStart = rule.publicPortStart;
    this.privateEnd = rule.privatePortEnd;
    this.publicEnd = rule.publicPortEnd;
    this.protocol = rule.protocol;
    this.address = rule.sourceCidrs[0];
    this.publicIpId = rule.publicIpId;
    this.projectId = rule.projectId;
  }
}

export class ListForwardRulesOutputDto {
  rules: ForwardRuleDto[];

  constructor(rules: PortForwardRuleModel[]) {
    this.rules = rules.map((r) => new ForwardRuleDto(r));
  }
}
