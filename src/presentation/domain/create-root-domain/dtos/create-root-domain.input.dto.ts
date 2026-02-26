export class CreateRootOwnerUserInputDto {
  name: string;
  email: string;
  username: string;
  password: string;
}

export class CreateRootDomainInputDto {
  ownerId?: string;
  ownerUser?: CreateRootOwnerUserInputDto;
  accountName: string;
  accountEmail: string;
  accountPassword: string;
}
