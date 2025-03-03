import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { KeycloakConfigService } from './infra/auth/keycloak.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Gemini API')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

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
