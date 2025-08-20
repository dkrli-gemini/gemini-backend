import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto, KeycloakService } from './keycloak.service';
import { Public } from './auth.decorator';

@Controller('keycloak')
@Public()
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) {}

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.keycloakService.createUser(createUserDto);
  }

  @Post('decode-token')
  @HttpCode(HttpStatus.OK)
  async decodeToken(@Body('token') token: string) {
    return this.keycloakService.decodeToken(token);
  }
}
