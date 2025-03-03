import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserRepositoryModule } from '../db/postgres/user/user-repository.module';
import { AuthController } from './auth.controller';
import { KeycloakConfigService } from './keycloak.config';
import { Protected } from './keycloak.guard';

@Module({
  imports: [PassportModule, UserRepositoryModule],
  providers: [Protected, KeycloakConfigService],
  exports: [PassportModule, Protected, KeycloakConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
