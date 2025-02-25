import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { KeycloakStrategy } from './keycloak.strategy';

@Module({
  imports: [PassportModule],
  providers: [KeycloakStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
