import {
  IResourceLimit,
  ResourceTypeEnum,
} from 'src/domain/entities/resource-limit';

export class ResourceLimitDto {
  id: string;
  type: ResourceTypeEnum;
  limit: number;
  used: number;

  constructor(limit: IResourceLimit) {
    this.id = limit.id;
    this.type = limit.type;
    this.limit = limit.limit;
    this.used = limit.used;
  }
}

export class ListResourceLimitsOutputDto {
  resources: ResourceLimitDto[];

  constructor(resources: IResourceLimit[]) {
    this.resources = resources.map((r) => new ResourceLimitDto(r));
  }
}
