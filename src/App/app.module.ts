import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'Secret1234',
      database: 'PrimeVideo',
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        trustServerCertificate: true,
      },
    }),
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
