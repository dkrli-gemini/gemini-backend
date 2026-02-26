import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDomainOwnerUserInputDto {
  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  email: string;

  @ApiProperty({ type: 'string' })
  username: string;

  @ApiProperty({ type: 'string' })
  password: string;
}

export class CreateDomainChildInputDto {
  @ApiProperty({ type: 'string' })
  parentDomainId: string;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  accountEmail: string;

  @ApiProperty({ type: 'string' })
  accountPassword: string;

  @ApiProperty({ enum: ['CLIENT', 'DISTRIBUTOR'] })
  childKind: 'CLIENT' | 'DISTRIBUTOR';

  @ApiPropertyOptional({ enum: ['POOL', 'PAYG'] })
  billingType?: 'POOL' | 'PAYG';

  @ApiPropertyOptional({ type: 'string' })
  ownerId?: string;

  @ApiPropertyOptional({ type: CreateDomainOwnerUserInputDto })
  ownerUser?: CreateDomainOwnerUserInputDto;
}
