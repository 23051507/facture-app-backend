import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Validation globale des DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // supprime les champs non déclarés dans le DTO
    forbidNonWhitelisted: true, // erreur si champ inconnu envoyé
    transform: true,        // transforme automatiquement les types (string → number etc.)
  }));

  // CORS pour le frontend
  app.enableCors({
    origin: config.get<string>('app.frontendUrl'),
    credentials: true,
  });

  // Préfixe global API
  app.setGlobalPrefix('api/v1');

  const port = config.get<number>('app.port') ?? 3001;
  await app.listen(port);

  console.log(`🚀 Serveur démarré sur http://localhost:${port}/api/v1`);
  console.log(`📦 Environnement : ${config.get<string>('app.env')}`);
}
bootstrap();