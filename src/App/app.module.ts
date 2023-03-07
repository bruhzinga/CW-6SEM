import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GenresModule } from '../genres/genres.module';
import { ImagesModule } from '../images/images.module';
import { VideosModule } from '../videos/videos.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GenresModule,
    ImagesModule,
    VideosModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
