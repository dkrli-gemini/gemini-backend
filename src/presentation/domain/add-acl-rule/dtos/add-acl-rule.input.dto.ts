import { ArrayMinSize, IsString } from 'class-validator';
import {
  AclActionEnum,
  AclTraficTypeEnum,
  NetworkProtocolEnum,
} from 'src/domain/entities/acl-list';

export class AddAclRuleInputDto {
  @ArrayMinSize(1)
  @IsString({
    each: true,
  })
  cidrList: string[];
  action: AclActionEnum;

  @IsString()
  startPort: string;

  @IsString()
  endPort: string;
  trafficType: AclTraficTypeEnum;
  protocol: NetworkProtocolEnum;
  description?: string;
}
