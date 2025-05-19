import { ApiProperty } from '@nestjs/swagger';
import { INetwork } from 'src/domain/entities/network';

export class AddNetworkOutputDto {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: String })
  projectId: string;
  @ApiProperty({ type: String })
  gateway: string;
  @ApiProperty({ type: String })
  netmask: string;
  @ApiProperty({ type: String })
  cloudstackAclId: string;
  @ApiProperty({ type: String })
  cloudstackOfferId: string;

  constructor(network: INetwork) {
    this.id = network.id;
    this.name = network.name;
    this.projectId = network.project.id;
    this.gateway = network.gateway;
    this.netmask = network.netmask;
    this.cloudstackAclId = network.cloudstackAclId;
    this.cloudstackOfferId = network.cloudstackOfferId;
  }
}
