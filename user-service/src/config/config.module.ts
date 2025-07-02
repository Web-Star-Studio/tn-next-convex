import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import * as path from 'path';

@Global() // Torna o ConfigService disponível globalmente
@Module({
  imports: [
    NestConfigModule.forRoot({
      // Carrega o .env específico do ambiente, ou .env se não especificado
      envFilePath: [
        path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
        path.resolve(process.cwd(), '.env'), // Fallback para .env geral
      ],
      isGlobal: true, // Torna as funcionalidades do NestConfigModule (ex: process.env) globais
      // ignoreEnvFile: process.env.NODE_ENV === 'production', // Em produção, pode-se preferir variáveis de ambiente do sistema
      // validationSchema: Joi.object({ ... }) // Opcional: Adicionar validação com Joi
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
