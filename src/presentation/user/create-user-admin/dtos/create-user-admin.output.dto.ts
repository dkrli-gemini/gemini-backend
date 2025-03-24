import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'src/domain/entities/user';

export class CreateUserAdminOutputDto {
  @ApiProperty({ type: 'string' })
  id: string;
  @ApiProperty({ type: 'string' })
  name: string;
  @ApiProperty({ type: 'string' })
  email: string;

  constructor(user: Partial<IUser>) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
