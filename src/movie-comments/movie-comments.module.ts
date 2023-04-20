import { Module } from '@nestjs/common';
import { MovieCommentsGateway } from './movie-comments.gateway';
import { CommentsService } from '../comments/comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MoviesService } from '../movies/movies.service';
import { UsersService } from '../users/users.service';

@Module({
  providers: [
    MovieCommentsGateway,
    CommentsService,
    MoviesService,
    UsersService,
  ],
  imports: [PrismaModule],
})
export class MovieCommentsModule {}
