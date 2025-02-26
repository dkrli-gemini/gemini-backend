import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { KeycloakConfigService } from './infra/auth/keycloak.config';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
    }),
  );

  const keycloak = new KeycloakConfigService().getKeycloak();
  app.use(keycloak.middleware());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
