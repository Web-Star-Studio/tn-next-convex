import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity'; // Importar a entidade User

@Module({
  imports: [
    ConfigModule, // Nosso ConfigModule customizado
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importar ConfigModule para injetar ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('USER_SERVICE_DB_HOST') || 'localhost',
        port: configService.getNumber('USER_SERVICE_DB_PORT') || 5432,
        username: configService.get('USER_SERVICE_DB_USERNAME'),
        password: configService.get('USER_SERVICE_DB_PASSWORD'),
        database: configService.get('USER_SERVICE_DB_DATABASE'),
        entities: [User], // Adicionar todas as entidades aqui
        synchronize: !configService.isProduction, // true em dev (cuidado em prod, usar migrações)
        // synchronize: false, // Desabilitar synchronize para usar migrações
        // migrationsTableName: 'typeorm_migrations',
        // migrations: ['dist/migrations/*.js'],
        // cli: { migrationsDir: 'src/migrations' },
        logging: !configService.isProduction ? 'all' : ['error'],
      }),
      inject: [ConfigService], // Injetar ConfigService na factory
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
