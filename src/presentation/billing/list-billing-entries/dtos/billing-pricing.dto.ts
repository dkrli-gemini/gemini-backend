import { ResourceType } from '@prisma/client';
import { OrganizationBillingType } from 'src/domain/entities/domain';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class BillingPriceItemInputDto {
  @IsEnum(ResourceType)
  resourceType: ResourceType;

  @IsInt()
  @Min(0)
  unitPriceInCents: number;
}

export class UpsertBillingPricingInputDto {
  @IsUUID()
  domainId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillingPriceItemInputDto)
  prices: BillingPriceItemInputDto[];
}

export class BillingPriceItemOutputDto {
  resourceType: ResourceType;
  unitPriceInCents: number;

  constructor(input: BillingPriceItemOutputDto) {
    this.resourceType = input.resourceType;
    this.unitPriceInCents = input.unitPriceInCents;
  }
}

export class BillingPricingOutputDto {
  domainId: string;
  customPrices: BillingPriceItemOutputDto[];
  basePrices: BillingPriceItemOutputDto[];
  effectivePrices: BillingPriceItemOutputDto[];
  policy: BillingPolicyOutputDto;

  constructor(input: BillingPricingOutputDto) {
    this.domainId = input.domainId;
    this.customPrices = input.customPrices.map(
      (price) => new BillingPriceItemOutputDto(price),
    );
    this.basePrices = input.basePrices.map(
      (price) => new BillingPriceItemOutputDto(price),
    );
    this.effectivePrices = input.effectivePrices.map(
      (price) => new BillingPriceItemOutputDto(price),
    );
    this.policy = new BillingPolicyOutputDto(input.policy);
  }
}

export class BillingPolicyOutputDto {
  domainId: string;
  billingType: OrganizationBillingType;
  effectiveBillingType: OrganizationBillingType;
  parentDomainId?: string;
  parentEffectiveBillingType?: OrganizationBillingType;
  canEditBillingType: boolean;

  constructor(input: BillingPolicyOutputDto) {
    this.domainId = input.domainId;
    this.billingType = input.billingType;
    this.effectiveBillingType = input.effectiveBillingType;
    this.parentDomainId = input.parentDomainId ?? undefined;
    this.parentEffectiveBillingType =
      input.parentEffectiveBillingType ?? undefined;
    this.canEditBillingType = input.canEditBillingType;
  }
}

export class UpdateBillingPolicyInputDto {
  @IsUUID()
  domainId: string;

  @IsEnum(OrganizationBillingType)
  billingType: OrganizationBillingType;
}

export class GetBillingPolicyInputDto {
  @IsUUID()
  @IsOptional()
  domainId?: string;
}
