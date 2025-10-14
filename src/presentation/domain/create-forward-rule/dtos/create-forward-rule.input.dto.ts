import { NetworkProtocolEnum } from 'src/domain/entities/acl-list';

export class CreateForwardRuleInputDto {
  address: string;
  machineId: string;
  projectId: string;
  publicIpId: string;
  publicStart: string;
  publicEnd: string;
  privateStart: string;
  privateEnd: string;
  protocol: NetworkProtocolEnum;
}
