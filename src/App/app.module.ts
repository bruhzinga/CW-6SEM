import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { GenresModule } from '../genres/genres.module';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmFilter } from '../Exceptions/http-exception.filter';
import { ImagesModule } from '../images/images.module';

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
    GenresModule,
    ImagesModule,
    ConfigModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TypeOrmFilter,
    },
  ],
})
export class AppModule {}
