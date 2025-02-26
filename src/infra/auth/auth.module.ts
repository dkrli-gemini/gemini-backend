import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { KeycloakJwtStrategy } from './keycloak.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), ConfigModule],
  providers: [KeycloakJwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
