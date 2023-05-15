import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GenresModule } from '../genres/genres.module';
import { ImagesModule } from '../images/images.module';
import { VideosModule } from '../videos/videos.module';
import { PeopleModule } from '../people/people.module';
import { MoviesModule } from '../movies/movies.module';
import { CommentsModule } from '../comments/comments.module';
import { FavouritesModule } from '../favourites/favourites.module';
import { HistoryService } from '../history/history.service';
import { HistoryModule } from '../history/history.module';
import { MovieCommentsModule } from '../movie-comments/movie-comments.module';
import { WatchLaterModule } from '../watch-later/watch-later.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GenresModule,
    ImagesModule,
    VideosModule,
    PeopleModule,
    MoviesModule,
    CommentsModule,
    FavouritesModule,
    HistoryModule,
    MovieCommentsModule,
    WatchLaterModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
