import { ResourceTypeEnum } from 'src/domain/entities/resource-limit';

export class AddResourceLimitInputDto {
  type: ResourceTypeEnum;
  used: number;
  limit: number;
}
