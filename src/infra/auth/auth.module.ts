import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { KeycloakStrategy } from './keycloak.strategy';

@Module({
  imports: [PassportModule],
  providers: [KeycloakStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
