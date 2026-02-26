import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserOutputDto {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'string' })
  email: string;

  @ApiProperty({ type: 'string' })
  username: string;

  @ApiProperty({ type: 'boolean' })
  keycloakCreated: boolean;

  constructor(input: {
    id: string;
    name: string;
    email: string;
    username: string;
    keycloakCreated: boolean;
  }) {
    this.id = input.id;
    this.name = input.name;
    this.email = input.email;
    this.username = input.username;
    this.keycloakCreated = input.keycloakCreated;
  }
}
