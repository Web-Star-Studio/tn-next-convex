import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service'; // Ajustado para o caminho correto

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obter ConfigService para pegar a porta e outras configs
  const configService = app.get(ConfigService);
  const port = configService.getNumber('USER_SERVICE_PORT_INTERNAL') || 3000;

  // Pipe de validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não definidas no DTO
    forbidNonWhitelisted: true, // Lança erro se propriedades não whitelisted são enviadas
    transform: true, // Transforma o payload para o tipo do DTO
    transformOptions: {
      enableImplicitConversion: true, // Permite conversão implícita de tipos (ex: string de query param para number)
    },
  }));

  // Prefixo global para todas as rotas, se desejado (ex: /api/v1)
  // app.setGlobalPrefix('api/v1/users'); // Ou apenas 'users' se o API Gateway já faz o /v1

  await app.listen(port);
  console.log(`User service is running on: ${await app.getUrl()}`);
}
bootstrap();
