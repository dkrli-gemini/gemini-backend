export class CreateDomainAdminInputDto {
  ownerId: string;
  name: string;
  cloudstackDomainId: string;
  cloudstackAccountId: string;
  accountName: string;
  accountEmail: string;
  accountPassword: string;
  rootId: string;
  billingType?: string;
}
