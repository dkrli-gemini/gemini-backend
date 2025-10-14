import { IPublicIp } from 'src/domain/entities/public-ips';

export class PublicIpDto {
  id: string;
  address: string;

  constructor(id: string, address: string) {
    this.id = id;
    this.address = address;
  }
}

export class ListPublicIpsOutputDto {
  ips: PublicIpDto[];

  constructor(ips: IPublicIp[]) {
    this.ips = ips.map((ip) => new PublicIpDto(ip.id, ip.address));
  }
}
