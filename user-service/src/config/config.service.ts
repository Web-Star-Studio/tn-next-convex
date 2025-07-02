import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private nestConfigService: NestConfigService) {}

  get(key: string): string | undefined {
    return this.nestConfigService.get<string>(key);
  }

  getNumber(key: string): number | undefined {
    const value = this.nestConfigService.get<string>(key);
    return value ? parseInt(value, 10) : undefined;
  }

  getBoolean(key: string): boolean {
    const value = this.nestConfigService.get<string>(key);
    return value === 'true';
  }

  get isDevelopment(): boolean {
    return this.nestConfigService.get<string>('NODE_ENV') === 'development';
  }

  get isProduction(): boolean {
    return this.nestConfigService.get<string>('NODE_ENV') === 'production';
  }

  // Exemplo de acesso a variáveis de ambiente específicas do banco de dados
  // Estas são usadas pelo TypeOrmModule em app.module.ts
  // DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
  // são genéricas e serão prefixadas no .env (ex: USER_SERVICE_DB_HOST)

  // JWT Config
  get jwtSecret(): string {
    return this.nestConfigService.get<string>('USER_SERVICE_JWT_SECRET');
  }

  get jwtExpirationTime(): string {
    return this.nestConfigService.get<string>('USER_SERVICE_JWT_EXPIRATION_TIME');
  }
}
