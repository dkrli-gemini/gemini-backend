export class AcquirePublicIpOutputDto {
  acquired: boolean;
  id: string;

  constructor(id: string) {
    this.acquired = true;
    this.id = id;
  }
}
