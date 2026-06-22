import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, dbConfig, jwtConfig, redisConfig } from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ArticlesModule } from './articles/articles.module';
import { DevisModule } from './devis/devis.module';
import { FacturesModule } from './factures/factures.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigEntrepriseModule } from './config/config-entreprise.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, dbConfig, jwtConfig, redisConfig],
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ArticlesModule,
    DevisModule,
    FacturesModule,
    NotificationsModule,
    ConfigEntrepriseModule,
    CommonModule,
  ],
})
export class AppModule {}