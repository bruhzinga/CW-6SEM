import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './DTO/create-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(userId: string, CreateCommentDTO: CreateCommentDto) {
    return this.prisma.comment.create({
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
  }
}
