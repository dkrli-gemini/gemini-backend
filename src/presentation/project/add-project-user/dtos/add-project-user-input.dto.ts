import { RoleModel } from '@prisma/client';

export class AddProjectUserInputDto {
  userId: string;
  role: RoleModel;
}
