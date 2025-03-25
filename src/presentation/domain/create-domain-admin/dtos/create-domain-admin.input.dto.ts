import { ApiProperty } from '@nestjs/swagger';

export class CreateDomainAdminInputDto {
  ownerId: string;
  name: string;
  cloudstackDomainId: string;
  cloudstackAccountId: string;
}
