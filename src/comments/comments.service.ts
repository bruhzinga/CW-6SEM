import { HttpException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './DTO/create-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(userId: string, CreateCommentDTO: CreateCommentDto) {
    const result = await this.prisma.comment.create({
      data: {
        content: CreateCommentDTO.content,
        rating: CreateCommentDTO.rating,
        Movie: {
          connect: {
            id: CreateCommentDTO.movieId,
          },
        },
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
    if (result) {
      const averageRating = await this.prisma.comment.aggregate({
        where: {
          Movie: {
            id: CreateCommentDTO.movieId,
          },
        },
        _avg: {
          rating: true,
        },
      });

      await this.prisma.movie.update({
        where: {
          id: CreateCommentDTO.movieId,
        },
        data: {
          rating: Math.round(averageRating._avg.rating)
            ? Math.round(averageRating._avg.rating)
            : null,
        },
      });
      return result;
    }
  }

  deleteComment(userID: string, commentID: number) {
    return this.prisma.$transaction(async (prisma) => {
      const userId = await prisma.comment.delete({
        where: {
          id: commentID,
        },
        select: {
          User: {
            select: {
              id: true,
            },
          },
        },
      });

      if (userId.User.id !== userID) {
        throw new HttpException(
          'You are not authorized to delete this comment',
          401,
        );
      }
    });
  }
}
