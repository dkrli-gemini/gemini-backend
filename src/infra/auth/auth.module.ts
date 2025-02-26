import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { KeycloakConfigService } from './keycloak.config';
import { Protected } from './keycloak.guard';

@Module({
  imports: [PassportModule],
  providers: [Protected, KeycloakConfigService],
  exports: [PassportModule, Protected, KeycloakConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
