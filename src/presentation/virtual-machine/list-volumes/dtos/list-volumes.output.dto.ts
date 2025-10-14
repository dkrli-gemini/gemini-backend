import { ApiProperty } from '@nestjs/swagger';
import { IVolume } from 'src/domain/entities/volume';

export class VolumeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  capacity: number;

  constructor(name: string, capacity: number, id: string) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
  }
}

export class ListVolumesOutputDto {
  volumes: VolumeDto[];

  constructor(volumes: IVolume[]) {
    this.volumes = volumes.map(
      (v) => new VolumeDto(v.name, v.offer.capacity, v.id),
    );
  }
}
