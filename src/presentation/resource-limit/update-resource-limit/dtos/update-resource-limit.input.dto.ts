import { IsNumber, Min } from 'class-validator';

export class UpdateResourceLimitInputDto {
  @IsNumber()
  @Min(0)
  limit: number;
}
