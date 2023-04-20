import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavouritesService {
  constructor(private readonly prisma: PrismaService) {}

  async createFavourite(movieId: number, userId: string) {
    return this.prisma.favorite.create({
      data: {
        Movie: {
          connect: {
            id: movieId,
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

  deleteFavourite(movieId: number, userId: string) {
    return this.prisma.favorite.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });
  }

  getFavourites(id: string) {
    return this.prisma.favorite.findMany({
      where: {
        userId: id,
      },
      include: {
        Movie: true,
      },
    });
  }
}
